import { Picnic } from "../sdk/sdk";
import RecvStream from "../sdk/stream/RecvStream";
import { useEffect, useState } from "react";
import { SDKState } from "../types";
import { useSDKState } from "./useSDKState";

type UseStage = {
  streams: RecvStream[];
  info: string | null;
};

function getRecvStreamsInfo(state: SDKState): string | null {
  if (state.recvTransport === "connected") {
    return null;
  }
  if (state.recvTransport === "creating") {
    return "Creating connection";
  }
  if (state.recvTransport === "connecting") {
    return "Connecting";
  }
  if (state.recvTransport === "disconnected") {
    return "Disconnected, check your network";
  }

  return "Error, please reload";
}

export default function useRecvStreams(sdk: Picnic): UseStage {
  const [streams, setStreams] = useState(Array.from(sdk.getStreams().values()));
  const state = useSDKState(sdk);

  useEffect(() => {
    const listener = () => setStreams(Array.from(sdk.getStreams().values()));
    sdk.addEventListener("stream:update", listener);

    return (): void => {
      sdk.removeEventListener("stream:update", listener);
    };
  }, [sdk]);

  return { streams, info: getRecvStreamsInfo(state) };
}
