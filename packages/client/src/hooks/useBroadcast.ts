import { useEffect, useState, useCallback } from "react";
import SendStream from "../sdk/stream/SendStream";
import { Picnic } from "../sdk/sdk";

type UseBroadcast = {
  stream: SendStream | null;
  pause: (audio: boolean, video: boolean) => void;
};

export default function useBroadcast(sdk: Picnic): UseBroadcast {
  const [stream, setStream] = useState<SendStream | null>(null);

  useEffect(() => {
    // TODO: handle errors
    sdk.broadcast().then(setStream);

    return (): void => {
      // TODO: handle unmount
    };
  }, [sdk]);

  const pause = useCallback(
    (pauseAudio, pauseVideo) => {
      if (pauseAudio) {
        stream?.pauseAudio();
      } else {
        stream?.resumeAudio();
      }
      if (pauseVideo) {
        stream?.pauseVideo();
      } else {
        stream?.resumeVideo();
      }
    },
    [stream]
  );

  return { stream, pause };
}
