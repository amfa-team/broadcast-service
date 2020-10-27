import type { RecvStream } from "../../../../../sdk/stream/RecvStream";
import type { TransportState } from "../../../../../types";
export declare type RecvQuality = 0 | 1 | 2 | 3 | 4 | null;
export interface UseRecvStreamStatus {
    recvQuality: RecvQuality;
    producerAudioPaused: boolean;
}
export declare function useRecvStreamStatus(stream: RecvStream, state: TransportState): UseRecvStreamStatus;
//# sourceMappingURL=useRecvStreamStatus.d.ts.map