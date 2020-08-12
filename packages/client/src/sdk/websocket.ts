import { v4 as uuid } from "uuid";
import { Settings } from "../types";

type PendingReq = {
  resolve: (payload: unknown) => void;
  reject: (error: unknown) => void;
};

type WsPendingReq = Map<string, PendingReq>;

const pendingReqMap: WeakMap<WebSocket, WsPendingReq> = new WeakMap();

function onWsMessage(this: WebSocket, ev: MessageEvent) {
  const res = JSON.parse(ev.data);

  const wsPendingReq = pendingReqMap.get(this) ?? null;
  if (wsPendingReq === null) {
    console.error("onWsMessage: Pending request map not found");
    return;
  }

  if (res.success) {
    const pending = wsPendingReq.get(res.msgId);
    if (pending) {
      pending.resolve(res.payload);
    } else {
      console.error(
        "onWsMessage: Received response for unknown or expired message",
        res
      );
    }
  } else {
    const pending = wsPendingReq.get(res.msgId);
    if (pending) {
      pending.reject(res.error);
    } else {
      console.error(
        "onWsMessage: Received response for unknown or expired message",
        res
      );
    }
  }
}

function onWsError(this: WebSocket, error: Event) {
  console.error("OnWsError", error);
}

function onWsClose(this: WebSocket, event: CloseEvent) {
  console.warn("onWsClose", event);
  const wsPendingReq = pendingReqMap.get(this) ?? null;
  if (wsPendingReq !== null) {
    wsPendingReq.forEach((pendingReq) => {
      pendingReq.reject("onWsClose");
    });
    pendingReqMap.delete(this);
  }
}

export function createWebSocket(settings: Settings): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(settings.endpoint);
    pendingReqMap.set(ws, new Map());

    ws.addEventListener("message", onWsMessage);
    ws.addEventListener("open", () => {
      ws.removeEventListener("error", reject);
      resolve(ws);
    });
    ws.addEventListener("error", reject);
    ws.addEventListener("error", onWsError);
    ws.addEventListener("close", onWsClose);

    return ws;
  });
}

export async function sendMessage<T>(
  ws: WebSocket,
  token: string,
  action: string,
  data: Record<string, unknown> | null
): Promise<T> {
  return new Promise((resolve, reject) => {
    const msgId = uuid();

    let timeout: NodeJS.Timeout | null = null;

    const wsPendingReq = pendingReqMap.get(ws) ?? null;
    if (wsPendingReq === null) {
      reject("sendMessage: No pending request map");
      return;
    }

    const clear = () => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      wsPendingReq.delete(msgId);
    };

    timeout = setTimeout(() => {
      clear();
      reject("Request timeout");
    }, 10000);

    wsPendingReq.set(msgId, {
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

    ws.send(JSON.stringify({ action, data, token, msgId }));
  });
}
