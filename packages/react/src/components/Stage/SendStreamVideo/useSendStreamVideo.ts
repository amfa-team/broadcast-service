import { useCallback, useEffect, useState } from "react";
import type SendStream from "../../../sdk/stream/SendStream";
import type { SDKState } from "../../../types";
import type { Size } from "../StageGrid/layout";
import type { UseVideo } from "../Video";
import { useVideo } from "../Video";
import type { UseSendStreamStatus } from "./SendStreamOverlay";

export interface UseSendStreamVideo {
  // overlay: UseRecvStreamOverlay;
  video: UseVideo;
  overlay: UseSendStreamStatus;
}

export interface UseSendStreamVideoParams {
  sendStream: SendStream;
  onResize: (size: Size, id: string) => void;
  state: SDKState;
}

export function useSendStreamVideo({
  sendStream,
  onResize,
  state,
}: UseSendStreamVideoParams): UseSendStreamVideo {
  const [media, setMedia] = useState<MediaStream | null>(null);
  const id = sendStream.getId();
  const onVideoResize = useCallback(
    (size) => {
      onResize(size, id);
    },
    [onResize, id],
  );

  useEffect(() => {
    const listener = () => {
      setMedia(sendStream.getUserMediaStream());
    };
    sendStream.addEventListener("media:change", listener);
    listener();

    return (): void => {
      sendStream.removeEventListener("media:change", listener);
    };
  }, [sendStream]);

  return {
    video: useVideo({
      media,
      muted: true,
      flip: !sendStream.isScreenShareEnabled(),
      onResize: onVideoResize,
    }),
    overlay: {
      state: state.sendTransport,
    },
  };
}
