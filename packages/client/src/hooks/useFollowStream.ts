import RecvStream from "../sdk/stream/RecvStream";
import { useEffect } from "react";

type UseFollowStream = {
  stream: MediaStream;
};

export default function useFollowStream(stream: RecvStream): UseFollowStream {
  const media = stream.getMediaStream();

  useEffect(() => {
    stream.resume();
    return () => {
      stream.pause();
    };
  }, [stream]);

  return { stream: media };
}
