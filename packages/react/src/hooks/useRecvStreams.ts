import { useEffect, useState } from "react";
import type { IBroadcastSdk } from "../sdk/sdk";
import type { IRecvStream } from "../sdk/stream/RecvStream";

export function useRecvStreams(sdk: IBroadcastSdk): IRecvStream[] {
  const [recvStreams, setStreams] = useState<IRecvStream[]>([]);

  useEffect(() => {
    const listener = () => {
      setStreams(sdk.getRecvStreams());
    };

    sdk.addEventListener("stream:update", listener);

    listener();

    return (): void => {
      sdk.removeEventListener("stream:update", listener);
    };
  }, [sdk]);

  return recvStreams;
}
