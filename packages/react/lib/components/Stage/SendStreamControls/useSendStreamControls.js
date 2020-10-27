import { useCallback, useEffect, useState } from "react";
export default function useSendStreamControls({ stream, toggleActive, extraControls, }) {
    const [audioPaused, setAudioPaused] = useState(stream?.isAudioPaused() ?? false);
    const [videoPaused, setVideoPaused] = useState(stream?.isVideoPaused() ?? false);
    const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(stream?.isScreenShareEnabled() ?? false);
    const [active, setActive] = useState(stream !== null);
    useEffect(() => {
        const listener = () => {
            setAudioPaused(stream?.isAudioPaused() ?? false);
            setVideoPaused(stream?.isVideoPaused() ?? false);
            setIsScreenShareEnabled(stream?.isScreenShareEnabled() ?? false);
        };
        setActive(stream !== null);
        stream?.addEventListener("stream:pause", listener);
        stream?.addEventListener("stream:resume", listener);
        stream?.addEventListener("media:change", listener);
        listener();
        return () => {
            stream?.removeEventListener("stream:pause", listener);
            stream?.removeEventListener("stream:resume", listener);
            stream?.addEventListener("media:change", listener);
        };
    }, [stream]);
    const toggleAudio = useCallback(async () => {
        if (audioPaused) {
            await stream?.resumeAudio();
        }
        else {
            await stream?.pauseAudio();
        }
        setAudioPaused(!audioPaused);
    }, [stream, audioPaused]);
    const toggleVideo = useCallback(async () => {
        if (videoPaused) {
            await stream?.resumeVideo();
        }
        else {
            await stream?.pauseVideo();
        }
        setVideoPaused(!videoPaused);
    }, [stream, videoPaused]);
    const toggleScreenShare = useCallback(async () => {
        if (isScreenShareEnabled) {
            await stream?.disableShare();
        }
        else {
            await stream?.screenShare();
        }
        setIsScreenShareEnabled(!isScreenShareEnabled);
    }, [stream, isScreenShareEnabled]);
    return {
        active,
        audioPaused,
        videoPaused,
        isScreenShareEnabled,
        toggleAudio,
        toggleActive,
        toggleVideo,
        toggleScreenShare,
        extraControls: extraControls ?? [],
    };
}
//# sourceMappingURL=useSendStreamControls.js.map