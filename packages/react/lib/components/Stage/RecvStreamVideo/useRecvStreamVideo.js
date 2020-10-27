import { useCallback } from "react";
import { useVideo } from "../Video";
import { useRecvStreamOverlay } from "./RecvStreamOverlay";
export function useRecvStreamVideo({ recvStream, onResize, setMain, isMain, state, }) {
    const id = recvStream.getId();
    const onVideoResize = useCallback((size) => {
        onResize(size, id);
    }, [onResize, id]);
    return {
        overlay: useRecvStreamOverlay({
            recvStream,
            setMain,
            isMain,
            state: state.recvTransport,
        }),
        video: useVideo({
            media: recvStream.getMediaStream(),
            muted: false,
            flip: false,
            onResize: onVideoResize,
        }),
        id: recvStream.getId(),
    };
}
//# sourceMappingURL=useRecvStreamVideo.js.map