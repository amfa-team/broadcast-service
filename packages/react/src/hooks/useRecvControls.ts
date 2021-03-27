import { useCallback } from "react";
import type { IBroadcastSdk } from "../sdk/sdk";
import type { IRecvStream } from "../sdk/stream/RecvStream";

export function useRecvControls(sdk: IBroadcastSdk) {
  const setFullScreen = useCallback(
    async (recvStream: IRecvStream) => {
      await sdk.setMainRecvStream(recvStream.getId());
    },
    [sdk],
  );

  return {
    setFullScreen,
  };
}
