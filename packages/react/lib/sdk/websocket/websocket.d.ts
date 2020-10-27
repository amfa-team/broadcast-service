import { EventTarget } from "event-target-shim";
import type { Settings, WebSocketState } from "../../types";
import type { Empty, ServerEvents } from "../events/event";
import { PicnicEvent } from "../events/event";
export declare type WebSocketEvents = ServerEvents & {
    "state:change": PicnicEvent<WebSocketState>;
};
export declare class PicnicWebSocket extends EventTarget<WebSocketEvents, Empty, "strict"> {
    #private;
    constructor(settings: Settings);
    getState(): WebSocketState;
    setState(state: WebSocketState): void;
    refresh(): Promise<void>;
    destroy(): Promise<void>;
    load(): Promise<void>;
    send<T>(action: string, data: Record<string, unknown> | null): Promise<T>;
}
//# sourceMappingURL=websocket.d.ts.map