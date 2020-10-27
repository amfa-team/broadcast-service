import { useEffect, useState } from "react";
function getRecvQuality(state) {
    if (state.paused || state.producerPaused) {
        return null;
    }
    if (state.score <= 0) {
        return 0;
    }
    if (state.score <= 2) {
        return 1;
    }
    if (state.score <= 5) {
        return 2;
    }
    if (state.score <= 8) {
        return 3;
    }
    return 4;
}
export function useRecvStreamStatus(stream, state) {
    const [audioState, setAudioState] = useState(stream.getAudioState());
    const [videoState, setVideoState] = useState(stream.getVideoState());
    const [error, setError] = useState(null);
    useEffect(() => {
        stream.resume().catch(setError);
        const listener = (event) => {
            const { kind, state: s } = event.data;
            if (kind === "audio") {
                setAudioState(s);
            }
            else {
                setVideoState(s);
            }
        };
        stream.addEventListener("state", listener);
        setAudioState(stream.getAudioState());
        setVideoState(stream.getVideoState());
        return () => {
            stream.removeEventListener("state", listener);
        };
    }, [stream]);
    const recvQuality = getRecvQuality(videoState) ?? getRecvQuality(audioState);
    if (error) {
        throw error;
    }
    return {
        recvQuality: state !== "connected" ? 0 : recvQuality,
        producerAudioPaused: audioState.producerPaused,
    };
}
//# sourceMappingURL=useRecvStreamStatus.js.map