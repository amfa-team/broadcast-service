import { useEffect, useState } from "react";
import type { IBroadcastSdk } from "../sdk/sdk";
import type { ISendStream } from "../sdk/stream/SendStream";

export function useSendStream(sdk: IBroadcastSdk) {
  const [sendStream, setSendStream] = useState<ISendStream | null>(null);

  useEffect(() => {
    const listener = () => {
      setSendStream(sdk.getBroadcastStream());
    };

    listener();

    sdk.addEventListener("broadcast:init", listener);
    sdk.addEventListener("broadcast:start", listener);
    sdk.addEventListener("broadcast:stop", listener);

    return () => {
      sdk.removeEventListener("broadcast:init", listener);
      sdk.removeEventListener("broadcast:start", listener);
      sdk.removeEventListener("broadcast:stop", listener);
    };
  }, [sdk]);

  return sendStream;
}
