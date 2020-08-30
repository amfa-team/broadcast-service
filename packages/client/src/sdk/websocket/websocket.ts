import { v4 as uuid } from "uuid";
import { Settings, WebSocketState } from "../../types";
import { PicnicEvent } from "../events/event";

type PendingReq = {
  resolve: (payload: unknown) => void;
  reject: (error: unknown) => void;
};

type WsPendingReq = Map<string, PendingReq>;

const RESPONSE_TIMEOUT = 60000;
const REFRESH_INTERVAL_MINUTES = 90;

async function sendToWs<T>(
  ws: WebSocket,
  pendingReq: WsPendingReq,
  token: string,
  action: string,
  data: Record<string, unknown> | null
): Promise<T> {
  return new Promise((resolve, reject) => {
    const msgId = uuid();

    let timeout: NodeJS.Timeout | null = null;

    const clear = () => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      pendingReq.delete(msgId);
    };

    timeout = setTimeout(() => {
      clear();
      reject("Request timeout");
    }, RESPONSE_TIMEOUT);

    pendingReq.set(msgId, {
      resolve: (payload) => {
        clear();
        // TODO: validation?
        resolve(payload as T);
      },
      reject: (error) => {
        clear();
        reject(error);
      },
    });

    if (
      ws.readyState === WebSocket.CLOSING ||
      ws.readyState === WebSocket.CLOSED
    ) {
      reject(new Error("Websocket is closed"));
    } else {
      ws.send(JSON.stringify({ action, data, token, msgId }));
    }
  });
}

export class PicnicWebSocket extends EventTarget {
  #ws: WebSocket;

  #state: WebSocketState = "initial";

  #pingID: NodeJS.Timeout | null = null;

  #refreshID: NodeJS.Timeout | null = null;

  #settings: Settings;

  #pendingReq: WsPendingReq = new Map();

  constructor(settings: Settings) {
    super();

    this.#settings = settings;

    this.#ws = new WebSocket(settings.endpoint);

    this.#ws.addEventListener("message", this.#onMessage);
    this.#ws.addEventListener("error", this.#onError);
    this.#ws.addEventListener("close", this.#onClose);
  }

  #scheduleRefresh = (): void => {
    // refresh websocket every 90 min
    this.#refreshID = setTimeout(
      () => this.refresh(),
      REFRESH_INTERVAL_MINUTES * 60 * 1000
    );
  };

  getState(): WebSocketState {
    return this.#state;
  }

  setState(state: WebSocketState): void {
    const event = new PicnicEvent("state:change", this.getState());
    this.#state = state;
    this.dispatchEvent(event);
  }

  async refresh(): Promise<void> {
    const ws = new WebSocket(this.#settings.endpoint);

    try {
      // Load the new WebSocket
      await new Promise((resolve, reject) => {
        ws.addEventListener("open", () => {
          ws.removeEventListener("error", reject);
          this.#ping();
          resolve();
        });
        ws.addEventListener("error", reject);
      });
    } catch (e) {
      console.error("PicnicWebSocket.refresh: fail to reconnect", e);
      ws.close();
      return;
    }

    // Be sure to handle properly any new messages from now on
    ws.addEventListener("message", this.#onMessage);
    ws.addEventListener("error", this.#onError);
    ws.addEventListener("close", this.#onClose);

    try {
      const success = await sendToWs<boolean>(
        ws,
        this.#pendingReq,
        this.#settings.token,
        "/sfu/refresh",
        null
      );
      console.warn(success);
    } catch (e) {
      console.error("PicnicWebSocket.refresh: fail to refresh", e);
      // We do not want to trigger onClose event
      ws.removeEventListener("message", this.#onMessage);
      ws.removeEventListener("error", this.#onError);
      ws.removeEventListener("close", this.#onClose);
      ws.close();
      return;
    }

    const oldWs = this.#ws;
    this.#ws = ws;

    // Make sure we complete all pending requests on old connection
    setTimeout(() => {
      // We do not want to trigger onClose event
      oldWs.removeEventListener("message", this.#onMessage);
      oldWs.removeEventListener("error", this.#onError);
      oldWs.removeEventListener("close", this.#onClose);
      oldWs.close();
    }, RESPONSE_TIMEOUT + 1000);

    this.#scheduleRefresh();
  }

  async destroy(): Promise<void> {
    if (this.#pingID !== null) {
      clearTimeout(this.#pingID);
    }
    if (this.#refreshID !== null) {
      clearTimeout(this.#refreshID);
    }
    this.#ws.close();
  }

  #ping: () => Promise<void> = async () => {
    try {
      await this.send("/sfu/ping", null);
    } catch (e) {
      console.error(e);
    }
    this.#pingID = setTimeout(this.#ping, 60 * 1000);
  };

  async load(): Promise<void> {
    if (this.#ws.readyState === WebSocket.OPEN) {
      this.setState("connected");
      this.#ping();
      this.#scheduleRefresh();
      return;
    }

    if (this.#ws.readyState !== WebSocket.CONNECTING) {
      this.setState("disconnected");
      throw new Error("PicnicWebSocket.load: Unable to connect");
    }

    this.setState("connecting");

    return new Promise((resolve, reject) => {
      this.#ws.addEventListener("open", () => {
        this.setState("connected");
        this.#ws.removeEventListener("error", reject);
        this.#ping();
        this.#scheduleRefresh();
        resolve();
      });
      this.#ws.addEventListener("error", reject);
    });
  }

  async send<T>(
    action: string,
    data: Record<string, unknown> | null
  ): Promise<T> {
    return sendToWs(
      this.#ws,
      this.#pendingReq,
      this.#settings.token,
      action,
      data
    );
  }

  #onMessage = (event: MessageEvent): void => {
    const msg = JSON.parse(event.data);

    if (msg.type === "response") {
      const pending = this.#pendingReq.get(msg.msgId);
      if (pending) {
        if (msg.success) {
          pending.resolve(msg.payload);
        } else {
          pending.reject(msg.error);
        }
      } else {
        console.error(
          "onWsMessage: Received response for unknown or expired message",
          msg
        );
      }
    }

    if (msg.type === "event") {
      const event = new PicnicEvent(msg.payload.type, msg.payload.data);
      this.dispatchEvent(event);
    }

    if (msg.type === "cmd") {
      if (msg.payload.fn === "reload") {
        // Last resort command to trigger a reload
        window.location.reload();
      }
    }
  };

  #onClose = (event: CloseEvent): void => {
    this.setState("closed");
    console.warn("PicnicWebSocket.onClose:", {
      code: event.code,
      wasClean: event.wasClean,
      reason: event.reason,
    });
    this.#pendingReq.forEach((pendingReq) => {
      pendingReq.reject("onWsClose");
    });
  };

  #onError = (event: Event): void => {
    console.warn("PicnicWebSocket.onError:", event);
  };
}
