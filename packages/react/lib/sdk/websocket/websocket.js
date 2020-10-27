import { Severity, captureException, captureMessage } from "@sentry/react";
import { EventTarget } from "event-target-shim";
import { v4 as uuid } from "uuid";
import PicnicError from "../../exceptions/PicnicError";
import { PicnicEvent } from "../events/event";
const RESPONSE_TIMEOUT = 60000;
const REFRESH_INTERVAL_MINUTES = 90;
async function sendToWs(ws, pendingReq, token, action, data) {
    return new Promise((resolve, reject) => {
        const msgId = uuid();
        let timeout = null;
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
                resolve(payload);
            },
            reject: (error) => {
                clear();
                reject(error);
            },
        });
        if (ws.readyState === WebSocket.CLOSING ||
            ws.readyState === WebSocket.CLOSED) {
            reject(new Error("Websocket is closed"));
        }
        else {
            ws.send(JSON.stringify({ action, data, token, msgId }));
        }
    });
}
export class PicnicWebSocket extends EventTarget {
    constructor(settings) {
        super();
        this.#state = "initial";
        this.#pingID = null;
        this.#refreshID = null;
        this.#pendingReq = new Map();
        this.#scheduleRefresh = () => {
            // refresh websocket every 90 min
            this.#refreshID = setTimeout(() => {
                this.refresh().catch(console.error);
            }, REFRESH_INTERVAL_MINUTES * 60 * 1000);
        };
        this.#ping = async () => {
            try {
                await this.send("/sfu/ping", null);
            }
            catch (e) {
                console.error(e);
                captureException(e);
            }
            this.#pingID = setTimeout(() => {
                this.#ping().catch(console.error);
            }, 60 * 1000);
        };
        this.#onMessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === "response") {
                const pending = this.#pendingReq.get(msg.msgId);
                if (pending) {
                    if (msg.success) {
                        pending.resolve(msg.payload);
                    }
                    else {
                        pending.reject(msg.error);
                    }
                }
                else {
                    captureMessage("onWsMessage: Received response for unknown or expired message", { level: Severity.Error, extra: msg });
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
        this.#onClose = (event) => {
            this.setState("closed");
            console.warn("PicnicWebSocket.onClose:", {
                code: event.code,
                wasClean: event.wasClean,
                reason: event.reason,
            });
            this.#pendingReq.forEach((pendingReq) => {
                pendingReq.reject(new Error("PicnicWebSocket.onError: websocket is closing"));
            });
        };
        this.#onError = (event) => {
            console.warn("PicnicWebSocket.onError:", event);
        };
        this.#settings = settings;
        this.#ws = new WebSocket(settings.endpoint);
        this.#ws.addEventListener("message", this.#onMessage);
        this.#ws.addEventListener("error", this.#onError);
        this.#ws.addEventListener("close", this.#onClose);
    }
    #ws;
    #state;
    #pingID;
    #refreshID;
    #settings;
    #pendingReq;
    #scheduleRefresh;
    getState() {
        return this.#state;
    }
    setState(state) {
        this.#state = state;
        const event = new PicnicEvent("state:change", this.getState());
        this.dispatchEvent(event);
    }
    async refresh() {
        const ws = new WebSocket(this.#settings.endpoint);
        try {
            // Load the new WebSocket
            await new Promise((resolve, reject) => {
                ws.addEventListener("open", async () => {
                    ws.removeEventListener("error", reject);
                    await this.#ping();
                    resolve();
                });
                ws.addEventListener("error", reject);
            });
        }
        catch (e) {
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
            const success = await sendToWs(ws, this.#pendingReq, this.#settings.token, "/sfu/refresh", null);
            console.warn(success);
        }
        catch (e) {
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
    async destroy() {
        if (this.#pingID !== null) {
            clearTimeout(this.#pingID);
        }
        if (this.#refreshID !== null) {
            clearTimeout(this.#refreshID);
        }
        this.#ws.close();
    }
    #ping;
    async load() {
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
                resolve();
            });
            this.#ws.addEventListener("error", reject);
        });
    }
    async send(action, data) {
        return sendToWs(this.#ws, this.#pendingReq, this.#settings.token, action, data);
    }
    #onMessage;
    #onClose;
    #onError;
}
//# sourceMappingURL=websocket.js.map