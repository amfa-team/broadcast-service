import { useCallback, useEffect, useState } from "react";
export function useRecvStreamControls(params) {
    const { recvStream, setMain, isMain } = params;
    const [audioPaused, setAudioPaused] = useState(recvStream.isAudioPaused());
    const [videoPaused, setVideoPaused] = useState(recvStream.isVideoPaused());
    useEffect(() => {
        const listener = () => {
            setAudioPaused(recvStream.isAudioPaused());
            setVideoPaused(recvStream.isVideoPaused());
        };
        recvStream.addEventListener("stream:pause", listener);
        recvStream.addEventListener("stream:resume", listener);
        listener();
        return () => {
            recvStream.removeEventListener("stream:pause", listener);
            recvStream.removeEventListener("stream:resume", listener);
        };
    }, [recvStream]);
    const toggleAudio = useCallback(async () => {
        if (audioPaused) {
            await recvStream.resumeAudio();
        }
        else {
            await recvStream.pauseAudio();
        }
        setAudioPaused(!audioPaused);
    }, [recvStream, audioPaused]);
    const toggleVideo = useCallback(async () => {
        if (videoPaused) {
            await recvStream.resumeVideo();
        }
        else {
            await recvStream.pauseVideo();
        }
        setVideoPaused(!videoPaused);
    }, [recvStream, videoPaused]);
    const maximize = useCallback(() => {
        setMain(recvStream.getId());
    }, [recvStream, setMain]);
    return {
        audioPaused,
        videoPaused,
        toggleAudio,
        toggleVideo,
        maximize: isMain ? null : maximize,
    };
}
//# sourceMappingURL=useRecvStreamControls.js.map