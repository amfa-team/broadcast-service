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

  const toggleAudio = useCallback(() => {
    setAudioPaused(!audioPaused);
    if (audioPaused) {
      stream.resumeAudio();
    } else {
      stream.pauseAudio();
    }
  }, [stream, audioPaused]);
  const toggleVideo = useCallback(() => {
    setVideoPaused(!videoPaused);
    if (videoPaused) {
      stream.resumeVideo();
    } else {
      stream.pauseVideo();
    }
  }, [stream, videoPaused]);

  return { audioPaused, videoPaused, toggleAudio, toggleVideo };
}
