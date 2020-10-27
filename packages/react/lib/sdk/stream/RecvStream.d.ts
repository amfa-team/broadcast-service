import type { ConsumerState } from "@amfa-team/types";
import { EventTarget } from "event-target-shim";
import type { PicnicDevice } from "../device/device";
import type { Empty, ServerEvents } from "../events/event";
import { PicnicEvent } from "../events/event";
import type { PicnicTransport } from "../transport/transport";
import type { PicnicWebSocket } from "../websocket/websocket";
interface RecvStreamOptions {
    ws: PicnicWebSocket;
    transport: PicnicTransport;
    device: PicnicDevice;
    sourceTransportId: string;
}
export declare type RecvStreamEvents = {
    state: PicnicEvent<{
        state: Pick<ServerEvents["streamConsumer:state"]["data"], "score" | "producerScore" | "paused" | "producerPaused">;
        kind: "audio" | "video";
    }>;
    "stream:pause": PicnicEvent<{
        kind: "audio" | "video";
    }>;
    "stream:resume": PicnicEvent<{
        kind: "audio" | "video";
    }>;
};
export declare class RecvStream extends EventTarget<RecvStreamEvents, Empty, "strict"> {
    #private;
    constructor(options: RecvStreamOptions);
    destroy(): Promise<void>;
    getCreatedAt(): number;
    getId(): string;
    load(producerId: string): Promise<void>;
    isReady(): boolean;
    pauseAudio(): Promise<void>;
    resumeAudio(): Promise<void>;
    isAudioPaused(): boolean;
    getAudioState(): ConsumerState;
    pauseVideo(): Promise<void>;
    resumeVideo(): Promise<void>;
    isVideoPaused(): boolean;
    getVideoState(): ConsumerState;
    resume(): Promise<void>;
    pause(): Promise<void>;
    getMediaStream(): MediaStream;
}
export {};
//# sourceMappingURL=RecvStream.d.ts.map