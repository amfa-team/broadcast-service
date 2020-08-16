import { useEffect, useState, useCallback } from "react";
import SendStream from "../sdk/stream/SendStream";

type UseSendStreamControls = {
  audioPaused: boolean;
  videoPaused: boolean;
  pauseAudio: (pause: boolean) => void;
  pauseVideo: (pause: boolean) => void;
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

  return { audioPaused, videoPaused, pauseAudio, pauseVideo };
}
