import { Picnic } from "../../sdk/sdk";
import { debounce } from "lodash-es";
import RecvStream from "../../sdk/stream/RecvStream";
import { useEffect, useState, useCallback } from "react";
import { SDKState } from "../../types";
import { useSDKState } from "../../hooks/useSDKState";
import { Size } from "./StageGrid/layout";
import { UseSendStreamControls } from "./SendStreamControls";
import SendStream from "../../sdk/stream/SendStream";
import useSendStreamControls from "./SendStreamControls/useSendStreamControls";

export interface UseRecvStreams {
  recvStreams: RecvStream[];
  info: string | null;
}

export interface UseSendStream {
  sendStream: SendStream | null;
  sendInfo: string | null;
  controls: UseSendStreamControls | null;
}

export interface UseStage extends UseRecvStreams, UseSendStream {
  onResize: (size: Size, id: string) => void;
  sizes: Size[];
}

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

function getBroadcastInfo(state: SDKState): string | null {
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

export function useSendStream(sdk: Picnic, enabled: boolean): UseSendStream {
  const [sendStream, setStream] = useState<SendStream | null>(null);
  const [active, setActive] = useState(false);
  const state = useSDKState(sdk);
  const toggleActive = useCallback(() => {
    setActive(!active);
    if (active) {
      setStream(null);
    }
  }, [active]);
  const controls = useSendStreamControls({ stream: sendStream, toggleActive });

  useEffect(() => {
    // TODO: handle errors like permissions
    let s: SendStream | null = null;
    if (enabled && active) {
      sdk.broadcast().then((stream) => {
        s = stream;
        setStream(stream);
      });
    }

    return (): void => {
      s?.destroy();
    };
  }, [sdk, enabled, active]);

  return {
    sendStream,
    sendInfo: getBroadcastInfo(state),
    controls: enabled ? controls : null,
  };
}

export function useRecvStreams(sdk: Picnic): UseRecvStreams {
  const [recvStreams, setStreams] = useState(
    Array.from(sdk.getStreams().values())
  );
  const state = useSDKState(sdk);

  useEffect(() => {
    const listener = () => setStreams(Array.from(sdk.getStreams().values()));
    sdk.addEventListener("stream:update", listener);

    return (): void => {
      sdk.removeEventListener("stream:update", listener);
    };
  }, [sdk]);

  return { recvStreams, info: getRecvStreamsInfo(state) };
}

export function useStage(sdk: Picnic, broadcastEnabled: boolean): UseStage {
  const { sendStream, sendInfo, controls } = useSendStream(
    sdk,
    broadcastEnabled
  );
  const [sizes, setSizes] = useState<Record<string, Size>>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onResize = useCallback(
    debounce((size, id) => {
      if (size.width === 0 || size.height === 0) {
        return;
      }
      setSizes((prevSize) => ({ ...prevSize, [id]: size }));
    }, 100),
    []
  );

  const { recvStreams, info } = useRecvStreams(sdk);

  const sizeArray = recvStreams.map(
    (recvStream) => sizes[recvStream.getId()] ?? { width: 360, height: 180 }
  );

  if (sendStream !== null) {
    sizeArray.push(sizes[sendStream.getId()] ?? { width: 360, height: 180 });
  }

  return {
    info,
    recvStreams,
    onResize,
    sendInfo,
    sizes: sizeArray,
    controls,
    sendStream,
  };
}
