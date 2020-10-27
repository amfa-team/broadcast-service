import type { RecvStream } from "../../../../sdk/stream/RecvStream";
import type { TransportState } from "../../../../types";
import type { UseRecvStreamControls } from "./RecvStreamControls";
import type { UseRecvStreamStatus } from "./RecvStreamStatus";
export interface UseRecvStreamOverlay {
    controls: UseRecvStreamControls;
    status: UseRecvStreamStatus;
}
export interface UseRecvStreamOverlayParams {
    recvStream: RecvStream;
    setMain: (id: string) => void;
    isMain: boolean;
    state: TransportState;
}
export declare function useRecvStreamOverlay(params: UseRecvStreamOverlayParams): UseRecvStreamOverlay;
//# sourceMappingURL=useRecvStreamOverlay.d.ts.map