import { useEffect, useState, useCallback } from "react";
import SendStream from "../../sdk/stream/SendStream";

export interface UseSendStreamControls {
  audioPaused: boolean;
  videoPaused: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  isScreenShareEnabled: boolean;
}

export default function useSendStreamControls(
  stream: SendStream
): UseSendStreamControls {
  const [audioPaused, setAudioPaused] = useState<boolean>(
    stream.isAudioPaused()
  );
  const [videoPaused, setVideoPaused] = useState<boolean>(
    stream.isVideoPaused()
  );
  const [isScreenShareEnabled, setIsScreenShareEnabled] = useState<boolean>(
    stream.isScreenShareEnabled()
  );

  useEffect(() => {
    const listener = () => {
      setAudioPaused(stream.isAudioPaused());
      setVideoPaused(stream.isVideoPaused());
      setIsScreenShareEnabled(stream.isScreenShareEnabled());
    };

    stream.addEventListener("stream:pause", listener);
    stream.addEventListener("stream:resume", listener);
    stream.addEventListener("media:change", listener);

    return () => {
      stream.removeEventListener("stream:pause", listener);
      stream.removeEventListener("stream:resume", listener);
      stream.addEventListener("media:change", listener);
    };
  }, [stream]);

  const toggleAudio = useCallback(async () => {
    setAudioPaused(!audioPaused);
    if (audioPaused) {
      await stream.resumeAudio();
    } else {
      await stream.pauseAudio();
    }
  }, [stream, audioPaused]);
  const toggleVideo = useCallback(async () => {
    setVideoPaused(!videoPaused);
    if (videoPaused) {
      await stream.resumeVideo();
    } else {
      await stream.pauseVideo();
    }
  }, [stream, videoPaused]);
  const toggleScreenShare = useCallback(async () => {
    setIsScreenShareEnabled(!isScreenShareEnabled);
    if (isScreenShareEnabled) {
      await stream.disableShare();
    } else {
      await stream.screenShare();
    }
  }, [stream, isScreenShareEnabled]);

  return {
    audioPaused,
    videoPaused,
    isScreenShareEnabled,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
  };
}
