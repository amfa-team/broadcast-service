import { useCallback, useEffect, useState } from "react";
import { useVideo } from "../Video";
export function useSendStreamVideo({ sendStream, onResize, state, }) {
    const [media, setMedia] = useState(null);
    const id = sendStream.getId();
    const onVideoResize = useCallback((size) => {
        onResize(size, id);
    }, [onResize, id]);
    useEffect(() => {
        const listener = () => {
            setMedia(sendStream.getUserMediaStream());
        };
        sendStream.addEventListener("media:change", listener);
        listener();
        return () => {
            sendStream.removeEventListener("media:change", listener);
        };
    }, [sendStream]);
    return {
        video: useVideo({
            media,
            muted: true,
            flip: !sendStream.isScreenShareEnabled(),
            onResize: onVideoResize,
        }),
        overlay: {
            state: state.sendTransport,
        },
    };
}
//# sourceMappingURL=useSendStreamVideo.js.map