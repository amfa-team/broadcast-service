import type { RecvStream } from "../../../sdk/stream/RecvStream";
import type { SDKState } from "../../../types";
import type { Size } from "../StageGrid/layout";
import type { UseVideo } from "../Video";
import type { UseRecvStreamOverlay } from "./RecvStreamOverlay";
export interface UseRecvStreamVideo {
    overlay: UseRecvStreamOverlay;
    video: UseVideo;
    id: string;
}
export interface UseRecvStreamVideoParams {
    recvStream: RecvStream;
    onResize: (size: Size, id: string) => void;
    setMain: (id: string) => void;
    isMain: boolean;
    state: SDKState;
}
export declare function useRecvStreamVideo({ recvStream, onResize, setMain, isMain, state, }: UseRecvStreamVideoParams): UseRecvStreamVideo;
//# sourceMappingURL=useRecvStreamVideo.d.ts.map