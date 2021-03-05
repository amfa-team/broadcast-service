import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSDKState } from "../../hooks/useSDKState";
import type { Picnic } from "../../sdk/sdk";
import type { RecvStream } from "../../sdk/stream/RecvStream";
import type SendStream from "../../sdk/stream/SendStream";
import type { SDKState } from "../../types";
import type { ControlElement } from "./Controls";
import type { UseSendStreamControls } from "./SendStreamControls";
import useSendStreamControls from "./SendStreamControls/useSendStreamControls";
import type { Size } from "./StageGrid/layout";

export interface UseRecvStreams {
  recvStreams: RecvStream[];
  setMain: (id: string) => void;
}

export interface UseSendStream {
  sendStream: SendStream | null;
  controls: UseSendStreamControls | null;
}

export interface UseStageParams {
  sdk: Picnic;
  broadcastEnabled: boolean;
  extraControls?: ControlElement[] | null;
}

export interface UseStage extends UseRecvStreams, UseSendStream {
  onResize: (size: Size, id: string) => void;
  sizes: Size[];
  extraControls: ControlElement[];
  state: SDKState;
}

export function useSendStream(sdk: Picnic, enabled: boolean): UseSendStream {
  const [sendStream, setStream] = useState<SendStream | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const toggleActive = useCallback(async () => {
    if (sendStream) {
      await sendStream.pauseAudio().catch(setError);
      await sendStream.pauseVideo().catch(setError);
      await sendStream.destroy();
      setStream(null);
    }

    setActive(!active);
  }, [active, sendStream]);
  const controls = useSendStreamControls({ stream: sendStream, toggleActive });

  useEffect(() => {
    // TODO: handle errors like permissions
    let s: SendStream | null = null;
    if (enabled && active) {
      sdk
        .broadcast()
        .then((stream) => {
          s = stream;
          setStream(stream);
        })
        .catch(setError);
    }

    return (): void => {
      s?.destroy().catch(console.error);
    };
  }, [sdk, enabled, active]);

  if (error !== null) {
    throw error;
  }

  return {
    sendStream,
    controls: enabled ? controls : null,
  };
}

export function useRecvStreams(sdk: Picnic): UseRecvStreams {
  const [recvStreams, setStreams] = useState<Record<string, RecvStream>>({});
  const [main, setMain] = useState<string | null>(null);

  useEffect(() => {
    const listener = () => {
      setStreams((prevProps) => {
        const prevKeys = Object.keys(prevProps);
        const nextRecvStreams = sdk.getStreams();
        if (
          prevKeys.length === nextRecvStreams.size &&
          prevKeys.every((k) => nextRecvStreams.has(k))
        ) {
          return prevProps;
        }

        const newProps: Record<string, RecvStream> = {};
        sdk.getStreams().forEach((stream, key) => {
          newProps[key] = stream;
        });

        return newProps;
      });
    };
    sdk.addEventListener("stream:update", listener);

    listener();

    return (): void => {
      sdk.removeEventListener("stream:update", listener);
    };
  }, [sdk]);

  const orderedRecvStream = useMemo(() => {
    const orderedStreams = Object.values(recvStreams).sort((a, b) => {
      if (a.getId() === main) {
        return -1;
      }

      if (b.getId() === main) {
        return 1;
      }

      return a.getCreatedAt() - b.getCreatedAt();
    });

    return orderedStreams;
  }, [recvStreams, main]);

  return {
    recvStreams: orderedRecvStream,
    setMain,
  };
}

export function useStage({
  sdk,
  extraControls,
  broadcastEnabled,
}: UseStageParams): UseStage {
  const state = useSDKState(sdk);
  const { sendStream, controls } = useSendStream(sdk, broadcastEnabled);
  const [sizes, setSizes] = useState<Record<string, undefined | Size>>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onResize = useCallback(
    debounce((size, id) => {
      if (size.width === 0 || size.height === 0) {
        return;
      }
      setSizes((prevSize) => {
        if (
          prevSize[id]?.width === size.width &&
          prevSize[id]?.height === size.height
        ) {
          // If same object is returned, react will skip re-render
          return prevSize;
        }

        return { ...prevSize, [id]: size };
      });
    }, 100),
    [],
  );

  const { recvStreams, setMain } = useRecvStreams(sdk);

  const sizeArray = recvStreams.map(
    (recvStream) => sizes[recvStream.getId()] ?? { width: 360, height: 180 },
  );

  if (sendStream !== null) {
    sizeArray.push(sizes[sendStream.getId()] ?? { width: 360, height: 180 });
  }

  return {
    recvStreams,
    onResize,
    sizes: sizeArray,
    controls,
    sendStream,
    extraControls: extraControls ?? [],
    setMain,
    state,
  };
}
