import type { RecvStream } from "../../../../../sdk/stream/RecvStream";
export interface UseRecvStreamControls {
    audioPaused: boolean;
    videoPaused: boolean;
    toggleAudio: () => void;
    toggleVideo: () => void;
    maximize: null | (() => void);
}
export interface UseRecvStreamControlsParams {
    recvStream: RecvStream;
    setMain: (id: string) => void;
    isMain: boolean;
}
export declare function useRecvStreamControls(params: UseRecvStreamControlsParams): UseRecvStreamControls;
//# sourceMappingURL=useRecvStreamControls.d.ts.map