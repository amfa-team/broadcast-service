import { useEffect, useState } from "react";
import SendStream from "../sdk/stream/SendStream";

type UseBroadcastMedia = {
  media: MediaStream | null;
};

export default function useBroadcastMedia(
  stream: SendStream | null
): UseBroadcastMedia {
  const [media, setMedia] = useState<MediaStream | null>(null);

  useEffect(() => {
    const listener = () => {
      setMedia(stream?.getUserMediaStream() ?? null);
    };
    stream?.addEventListener("media:change", listener);
    listener();

    return (): void => {
      stream?.removeEventListener("media:change", listener);
    };
  }, [stream]);

  return { media };
}
