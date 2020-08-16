import { useEffect, useState, useCallback } from "react";
import SendStream from "../sdk/stream/SendStream";

type UseSendStreamControls = {
  audioPaused: boolean;
  videoPaused: boolean;
  pauseAudio: (pause: boolean) => void;
  pauseVideo: (pause: boolean) => void;
  startScreenShare: () => void;
  stopScreenShare: () => void;
  isScreenShareEnabled: boolean;
};

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

  const pauseAudio = useCallback(
    (pause) => {
      if (pause) {
        stream?.pauseAudio();
      } else {
        stream?.resumeAudio();
      }
    },
    [stream]
  );
  const pauseVideo = useCallback(
    (pause) => {
      if (pause) {
        stream?.pauseVideo();
      } else {
        stream?.resumeVideo();
      }
    },
    [stream]
  );

  const startScreenShare = useCallback(() => {
    stream.screenShare();
  }, [stream]);

  const stopScreenShare = useCallback(() => {
    stream.disableShare();
  }, [stream]);

  return {
    audioPaused,
    videoPaused,
    pauseAudio,
    pauseVideo,
    startScreenShare,
    stopScreenShare,
    isScreenShareEnabled,
  };
}
