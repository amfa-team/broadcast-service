import { Severity, captureException, captureMessage } from "@sentry/react";
import { EventTarget } from "event-target-shim";
import { v4 as uuid } from "uuid";
import PicnicError from "../../exceptions/PicnicError";
import type { Settings, WebSocketState } from "../../types";
import type { Empty, ServerEvents } from "../events/event";
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
  spaceId: string,
  action: string,
  data: Record<string, unknown> | null,
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
      reject(new Error("Request timeout"));
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
      ws.send(JSON.stringify({ action, data, token, spaceId, msgId }));
    }
  });
}

export type WebSocketEvents = ServerEvents & {
  "state:change": PicnicEvent<WebSocketState>;
};

export class PicnicWebSocket extends EventTarget<
  WebSocketEvents,
  Empty,
  "strict"
> {
  #ws: WebSocket;

  #state: WebSocketState = "initial";

  #pingID: NodeJS.Timeout | null = null;

  #refreshID: NodeJS.Timeout | null = null;

  #settings: Settings;

  #token: string;

  #pendingReq: WsPendingReq = new Map();

  constructor(token: string, settings: Settings) {
    super();

    this.#settings = settings;
    this.#token = token;

    this.#ws = new WebSocket(settings.endpoint);

    this.#ws.addEventListener("message", this.#onMessage);
    this.#ws.addEventListener("error", this.#onError);
    this.#ws.addEventListener("close", this.#onClose);
  }

  #scheduleRefresh = (): void => {
    // refresh websocket every 90 min
    this.#refreshID = setTimeout(() => {
      this.refresh().catch(console.error);
    }, REFRESH_INTERVAL_MINUTES * 60 * 1000);
  };

  getState(): WebSocketState {
    return this.#state;
  }

  setState(state: WebSocketState): void {
    this.#state = state;
    const event = new PicnicEvent("state:change", this.getState());
    this.dispatchEvent(event);
  }

  async refresh(): Promise<void> {
    const ws = new WebSocket(this.#settings.endpoint);

    try {
      // Load the new WebSocket
      await new Promise((resolve, reject) => {
        ws.addEventListener("open", async () => {
          ws.removeEventListener("error", reject);
          await this.#ping();
          resolve(null);
        });
        ws.addEventListener("error", reject);
      });
    } catch (e) {
      console.error("PicnicWebSocket.refresh: fail to reconnect", e);
      captureException(e);
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
        this.#token,
        this.#settings.spaceId,
        "/sfu/refresh",
        null,
      );
      console.warn(success);
    } catch (e) {
      console.error("PicnicWebSocket.refresh: fail to refresh", e);
      captureException(e);

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
      captureException(e);
    }
    this.#pingID = setTimeout(() => {
      this.#ping().catch(console.error);
    }, 60 * 1000);
  };

  async load(): Promise<void> {
    if (this.#ws.readyState === WebSocket.OPEN) {
      this.setState("connected");
      this.#ping().catch(console.error);
      this.#scheduleRefresh();
      return;
    }

    if (this.#ws.readyState !== WebSocket.CONNECTING) {
      this.setState("disconnected");
      throw new PicnicError("PicnicWebSocket.load: Unable to connect", null);
    }

    this.setState("connecting");

    await new Promise((resolve, reject) => {
      this.#ws.addEventListener("open", () => {
        this.setState("connected");
        this.#ws.removeEventListener("error", reject);
        this.#ping().catch(console.error);
        this.#scheduleRefresh();
        resolve(null);
      });
      this.#ws.addEventListener("error", reject);
    });
  }

  async send<T>(
    action: string,
    data: Record<string, unknown> | null,
  ): Promise<T> {
    return sendToWs(
      this.#ws,
      this.#pendingReq,
      this.#token,
      this.#settings.spaceId,
      action,
      data,
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
        captureMessage(
          "onWsMessage: Received response for unknown or expired message",
          { level: Severity.Error, extra: msg },
        );
      }
    }

    if (msg.type === "event") {
      const e = new PicnicEvent(msg.payload.type, msg.payload.data);
      this.dispatchEvent(e);
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
      pendingReq.reject(
        new Error("PicnicWebSocket.onError: websocket is closing"),
      );
    });
  };

  #onError = (event: Event): void => {
    console.warn("PicnicWebSocket.onError:", event);
  };
}
