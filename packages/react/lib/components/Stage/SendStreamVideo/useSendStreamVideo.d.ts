import type SendStream from "../../../sdk/stream/SendStream";
import type { SDKState } from "../../../types";
import type { Size } from "../StageGrid/layout";
import type { UseVideo } from "../Video";
import type { UseSendStreamStatus } from "./SendStreamOverlay";
export interface UseSendStreamVideo {
    video: UseVideo;
    overlay: UseSendStreamStatus;
}
export interface UseSendStreamVideoParams {
    sendStream: SendStream;
    onResize: (size: Size, id: string) => void;
    state: SDKState;
}
export declare function useSendStreamVideo({ sendStream, onResize, state, }: UseSendStreamVideoParams): UseSendStreamVideo;
//# sourceMappingURL=useSendStreamVideo.d.ts.map