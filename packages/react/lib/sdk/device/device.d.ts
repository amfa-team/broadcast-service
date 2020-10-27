import type { InitConnectionParams } from "@amfa-team/types";
import { EventTarget } from "event-target-shim";
import type { types } from "mediasoup-client";
import type { DeviceState } from "../../types";
import type { Empty } from "../events/event";
import { PicnicEvent } from "../events/event";
import type { PicnicWebSocket } from "../websocket/websocket";
export declare type DeviceEvents = {
    "state:change": PicnicEvent<DeviceState>;
};
export declare class PicnicDevice extends EventTarget<DeviceEvents, Empty, "strict"> {
    #private;
    constructor(ws: PicnicWebSocket);
    getState(): DeviceState;
    setState(state: DeviceState): void;
    destroy(): Promise<void>;
    loadDevice(): Promise<void>;
    getInitConnectionParams(type: "send" | "recv"): InitConnectionParams;
    getRtpCapabilities(): types.RtpCapabilities;
    createMediasoupTransport(type: "send" | "recv", params: types.TransportOptions): types.Transport;
}
//# sourceMappingURL=device.d.ts.map