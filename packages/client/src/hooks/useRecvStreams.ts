import { useTransport } from "./useTransport";
import { types } from "mediasoup-client";
import { useState, useEffect } from "react";
import { recvStreams } from "../sdk/sfuClient";
import { Settings } from "../types";

type UseStage = {
  transport: null | types.Transport;
  streams: { [producerUserId: string]: MediaStream };
};

export default function useRecvStreams(
  settings: Settings,
  device: types.Device
): UseStage {
  const transport = useTransport(settings, device, "recv");
  const [streams, setStreams] = useState<{
    [producerUserId: string]: MediaStream;
  }>({});

  useEffect(() => {
    if (transport !== null) {
      recvStreams(settings, device, transport).then(setStreams);
    }

    return (): void => {
      if (transport !== null) {
        transport.close();
      }
    };
  }, [transport]);

  return { transport, streams };
}
