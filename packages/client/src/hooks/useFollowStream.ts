import RecvStream from "../sdk/stream/RecvStream";
import { useEffect, useState } from "react";
import { RecvStreamEventMap } from "../sdk/events/event";

type UseFollowStream = {
  stream: MediaStream;
  videoQuality: number;
  audioQuality: number;
};

export default function useFollowStream(stream: RecvStream): UseFollowStream {
  const media = stream.getMediaStream();
  const [audioQuality, setAudioQuality] = useState<number>(
    stream.getAudioQuality()
  );
  const [videoQuality, setVideoQuality] = useState<number>(
    stream.getVideoQuality()
  );

  useEffect(() => {
    stream.resume();

    const listener: any = (event: RecvStreamEventMap["quality"]) => {
      const { kind, score } = event.data;
      if (kind === "audio") {
        setAudioQuality(score);
      } else {
        setVideoQuality(score);
      }
    };
    stream.addEventListener("quality", listener);
    return () => {
      stream.pause();
      stream.removeEventListener("quality", listener);
    };
  }, [stream]);

  return { stream: media, videoQuality, audioQuality };
}
