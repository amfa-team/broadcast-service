import { EventTarget } from "event-target-shim";
import type { SDKState, Settings } from "../types";
import type { Empty } from "./events/event";
import { PicnicEvent } from "./events/event";
import { RecvStream } from "./stream/RecvStream";
import SendStream from "./stream/SendStream";
export declare const initialState: SDKState;
export declare type SdkEvents = {
    "state:change": PicnicEvent<SDKState>;
    "stream:update": PicnicEvent<Map<string, RecvStream>>;
    "broadcast:start": PicnicEvent<null>;
    "broadcast:stop": PicnicEvent<null>;
    destroy: PicnicEvent<null>;
};
export declare class Picnic extends EventTarget<SdkEvents, Empty, "strict"> {
    #private;
    constructor(settings: Settings);
    getState(): SDKState;
    destroy(): Promise<void>;
    getBroadcastStream(): SendStream | null;
    getStreams(): Map<string, RecvStream>;
    load(): Promise<void>;
    broadcast(): Promise<SendStream>;
}
//# sourceMappingURL=sdk.d.ts.map