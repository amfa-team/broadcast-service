import { Picnic } from "../sdk/sdk";
import RecvStream from "../sdk/stream/RecvStream";
import { useEffect, useState } from "react";

type UseStage = {
  streams: RecvStream[];
};

export default function useRecvStreams(sdk: Picnic): UseStage {
  const [streams, setStreams] = useState(Array.from(sdk.getStreams().values()));

  useEffect(() => {
    const listener = () => setStreams(Array.from(sdk.getStreams().values()));
    sdk.addEventListener("stream:update", listener);

    return (): void => {
      sdk.removeEventListener("stream:update", listener);
    };
  }, [sdk]);

  return { streams };
}
