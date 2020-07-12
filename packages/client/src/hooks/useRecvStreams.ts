import { useTransport } from "./useSendTransport";
import { types } from "mediasoup-client";
import { useState, useEffect } from "react";
import { recvStreams } from "../sdk/sfuClient";

type UseStage = {
  transport: null | types.Transport;
  streams: { [producerUserId: string]: MediaStream };
};

export default function useRecvStreams(
  userId: string,
  device: types.Device
): UseStage {
  const transport = useTransport(userId, device, "recv");
  const [streams, setStreams] = useState<{
    [producerUserId: string]: MediaStream;
  }>({});

  useEffect(() => {
    if (transport !== null) {
      recvStreams(userId, device, transport).then(setStreams);
    }

    return (): void => {
      if (transport !== null) {
        transport.close();
      }
    };
  }, [transport]);

  return { transport, streams };
}
