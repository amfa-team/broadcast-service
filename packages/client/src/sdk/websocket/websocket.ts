import { v4 as uuid } from "uuid";
import { Settings } from "../../types";
import { PicnicEvent } from "../events/event";

type PendingReq = {
  resolve: (payload: unknown) => void;
  reject: (error: unknown) => void;
};

type WsPendingReq = Map<string, PendingReq>;

export class PicnicWebSocket extends EventTarget {
  #ws: WebSocket;

  #pingID: NodeJS.Timeout | null = null;

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

  async destroy(): Promise<void> {
    if (this.#pingID !== null) {
      clearTimeout(this.#pingID);
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
      this.#ping();
      return;
    }

    if (this.#ws.readyState !== WebSocket.CONNECTING) {
      throw new Error("PicnicWebSocket.load: Unable to connect");
    }

    return new Promise((resolve, reject) => {
      this.#ws.addEventListener("open", () => {
        this.#ws.removeEventListener("error", reject);
        this.#ping();
        resolve();
      });
      this.#ws.addEventListener("error", reject);
    });
  }

  async send<T>(
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
        this.#pendingReq.delete(msgId);
      };

      timeout = setTimeout(() => {
        clear();
        reject("Request timeout");
      }, 60000);

      this.#pendingReq.set(msgId, {
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
        this.#ws.readyState === WebSocket.CLOSING ||
        this.#ws.readyState === WebSocket.CLOSED
      ) {
        reject(new Error("Websocket is closed"));
      } else {
        this.#ws.send(
          JSON.stringify({ action, data, token: this.#settings.token, msgId })
        );
      }
    });
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
    console.warn("PicnicWebSocket.oonError:", event);
  };
}