import { useEffect, useState, useCallback } from "react";
import SendStream from "../sdk/stream/SendStream";
import { Picnic } from "../sdk/sdk";

type UseBroadcast = {
  stream: SendStream | null;
};

export default function useBroadcast(sdk: Picnic): UseBroadcast {
  const [stream, setStream] = useState<SendStream | null>(null);

  useEffect(() => {
    // TODO: handle errors like permissions
    let s: SendStream | null = null;
    sdk.broadcast().then((sendStream) => {
      s = sendStream;
      setStream(sendStream);
    });

    return (): void => {
      s?.destroy();
    };
  }, [sdk]);

  return { stream };
}
