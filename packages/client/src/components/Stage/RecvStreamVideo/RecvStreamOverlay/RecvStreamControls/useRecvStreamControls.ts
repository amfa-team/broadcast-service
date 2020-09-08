import { useEffect, useState, useCallback } from "react";
import RecvStream from "../../../../../sdk/stream/RecvStream";

export interface UseRecvStreamControls {
  audioPaused: boolean;
  videoPaused: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
}

export function useRecvStreamControls(
  stream: RecvStream
): UseRecvStreamControls {
  const [audioPaused, setAudioPaused] = useState<boolean>(
    stream.isAudioPaused()
  );
  const [videoPaused, setVideoPaused] = useState<boolean>(
    stream.isVideoPaused()
  );

  useEffect(() => {
    const listener = () => {
      setAudioPaused(stream.isAudioPaused());
      setVideoPaused(stream.isVideoPaused());
    };

    stream.addEventListener("stream:pause", listener);
    stream.addEventListener("stream:resume", listener);

    return () => {
      stream.removeEventListener("stream:pause", listener);
      stream.removeEventListener("stream:resume", listener);
    };
  }, [stream]);

  const toggleAudio = useCallback(async () => {
    if (audioPaused) {
      await stream.resumeAudio();
    } else {
      await stream.pauseAudio();
    }
    setAudioPaused(!audioPaused);
  }, [stream, audioPaused]);
  const toggleVideo = useCallback(async () => {
    if (videoPaused) {
      await stream.resumeVideo();
    } else {
      await stream.pauseVideo();
    }
    setVideoPaused(!videoPaused);
  }, [stream, videoPaused]);

  return { audioPaused, videoPaused, toggleAudio, toggleVideo };
}
