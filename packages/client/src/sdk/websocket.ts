import { v4 as uuid } from "uuid";
import { Settings } from "../types";

type PendingReq = {
  resolve: (payload: unknown) => void;
  reject: (error: unknown) => void;
};

const pendingReqMap: Map<string, PendingReq> = new Map();

export function createWebSocket(): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket("ws://localhost:3001");
    ws.onmessage = (msg) => {
      const res = JSON.parse(msg.data);

      if (res.success) {
        const pending = pendingReqMap.get(res.msgId);
        if (pending) {
          pending.resolve(res.payload);
        } else {
          console.error(
            "Received response for unknown or expired message",
            res
          );
        }
      } else {
        const pending = pendingReqMap.get(res.msgId);
        if (pending) {
          pending.reject(res.error);
        } else {
          console.error(
            "Received response for unknown or expired message",
            res
          );
        }
      }
    };

    ws.onopen = () => resolve(ws);

    ws.onerror = reject;

    return ws;
  });
}

export async function sendMessage<T>(
  ws: WebSocket,
  action: string,
  settings: Settings,
  data: Record<string, unknown> | null
): Promise<T> {
  return new Promise((resolve, reject) => {
    const msgId = uuid();

    let timeout: NodeJS.Timeout | null = null;

    const clear = () => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      pendingReqMap.delete(msgId);
    };

    timeout = setTimeout(() => {
      clear();
      reject("Request timeout");
    }, 10000);

    pendingReqMap.set(msgId, {
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

    ws.send(
      JSON.stringify({
        action,
        data,
        token: settings.token,
        msgId,
      })
    );
  });
}
