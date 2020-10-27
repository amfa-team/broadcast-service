import { EventTarget } from "event-target-shim";
import type { Empty } from "../events/event";
import { PicnicEvent } from "../events/event";
import type { PicnicTransport } from "../transport/transport";
import type { PicnicWebSocket } from "../websocket/websocket";
declare global {
    interface MediaDevices {
        getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
    }
    interface MediaTrackConstraintSet {
        displaySurface?: ConstrainDOMString;
        logicalSurface?: ConstrainBoolean;
    }
}
export declare type SendStreamEvents = {
    "stream:pause": PicnicEvent<{
        kind: "audio" | "video";
    }>;
    "stream:resume": PicnicEvent<{
        kind: "audio" | "video";
    }>;
    "media:change": PicnicEvent<null>;
    start: PicnicEvent<null>;
    stop: PicnicEvent<null>;
};
export default class SendStream extends EventTarget<SendStreamEvents, Empty, "strict"> {
    #private;
    constructor(transport: PicnicTransport, ws: PicnicWebSocket);
    getId(): string;
    destroy(): Promise<void>;
    isActive(): boolean;
    load(): Promise<void>;
    screenShare(): Promise<void>;
    disableShare(): Promise<void>;
    isScreenShareEnabled(): boolean;
    pauseAudio(): Promise<void>;
    resumeAudio(): Promise<void>;
    isAudioPaused(): boolean;
    pauseVideo(): Promise<void>;
    resumeVideo(): Promise<void>;
    isVideoPaused(): boolean;
    getUserMediaStream(): MediaStream;
}
//# sourceMappingURL=SendStream.d.ts.map