import { useEffect, useState } from "react";
import SendStream from "../sdk/stream/SendStream";
import { Picnic } from "../sdk/sdk";
import { useSDKState } from "./useSDKState";
import { SDKState } from "../types";

type UseBroadcast = {
  stream: SendStream | null;
  info: string | null;
};

function getBroadcastInfo(state: SDKState): string | null {
  debugger;
  if (state.sendTransport === "connected") {
    return null;
  }
  if (state.sendTransport === "creating") {
    return "Creating connection";
  }
  if (state.sendTransport === "connecting") {
    return "Connecting";
  }
  if (state.sendTransport === "disconnected") {
    return "Disconnected, check your network";
  }

  return "Error, please reload";
}

export default function useBroadcast(sdk: Picnic): UseBroadcast {
  const [stream, setStream] = useState<SendStream | null>(null);
  const state = useSDKState(sdk);

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

  return { stream, info: getBroadcastInfo(state) };
}
