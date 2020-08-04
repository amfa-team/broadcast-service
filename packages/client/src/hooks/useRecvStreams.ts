import { useTransport } from "./useTransport";
import { types } from "mediasoup-client";
import { useState, useEffect } from "react";
import { recvStreams } from "../sdk/sfuClient";
import { SDK } from "../types";

type UseStage = {
  transport: null | types.Transport;
  streams: { [producerUserId: string]: MediaStream };
};

export default function useRecvStreams(sdk: SDK): UseStage {
  const transport = useTransport(sdk, "recv");
  const [streams, setStreams] = useState<{
    [producerUserId: string]: MediaStream;
  }>({});

  useEffect(() => {
    if (transport !== null) {
      recvStreams(sdk, transport).then(setStreams);
    }

    return (): void => {
      if (transport !== null) {
        transport.close();
      }
    };
  }, [sdk, transport]);

  return { transport, streams };
}
