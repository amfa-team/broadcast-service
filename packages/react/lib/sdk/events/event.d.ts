import type { StreamConsumerInfo, StreamInfo } from "@amfa-team/types";
export declare class PicnicEvent<T> extends Event {
    data: T;
    constructor(type: string, data: T);
}
export declare type ServerEvents = {
    "stream:add": PicnicEvent<StreamInfo>;
    "stream:remove": PicnicEvent<string>;
    "media:change": PicnicEvent<null>;
    "stream:pause": PicnicEvent<{
        kind: "audio" | "video";
    }>;
    "stream:resume": PicnicEvent<{
        kind: "audio" | "video";
    }>;
    "stream:state": PicnicEvent<StreamInfo>;
    "streamConsumer:state": PicnicEvent<StreamConsumerInfo>;
};
export declare type Empty = {};
//# sourceMappingURL=event.d.ts.map