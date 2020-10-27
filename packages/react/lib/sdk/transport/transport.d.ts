import { EventTarget } from "event-target-shim";
import type { types } from "mediasoup-client";
import type { TransportState } from "../../types";
import type { PicnicDevice } from "../device/device";
import type { Empty } from "../events/event";
import { PicnicEvent } from "../events/event";
import type { PicnicWebSocket } from "../websocket/websocket";
declare type TransportType = "send" | "recv";
export declare type TransportEvents = {
    "state:change": PicnicEvent<TransportState>;
};
export declare class PicnicTransport extends EventTarget<TransportEvents, Empty, "strict"> {
    #private;
    constructor(ws: PicnicWebSocket, device: PicnicDevice, type: TransportType);
    getState(): TransportState;
    destroy(): Promise<void>;
    getId(): string;
    load(): Promise<void>;
    produce(options: types.ProducerOptions & {
        track: MediaStreamTrack;
    }): Promise<types.Producer>;
    consume(options: types.ConsumerOptions): Promise<types.Consumer>;
}
export {};
//# sourceMappingURL=transport.d.ts.map