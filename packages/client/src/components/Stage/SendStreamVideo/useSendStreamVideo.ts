import { UseVideo, useVideo } from "../Video";
import SendStream from "../../../sdk/stream/SendStream";
import { Size } from "../StageGrid/layout";
import { useEffect, useState, useCallback } from "react";

export interface UseSendStreamVideo {
  // overlay: UseRecvStreamOverlay;
  video: UseVideo;
}

export interface UseSendStreamVideoParams {
  sendStream: SendStream;
  onResize: (size: Size, id: string) => void;
}

export function useSendStreamVideo({
  sendStream,
  onResize,
}: UseSendStreamVideoParams): UseSendStreamVideo {
  const [media, setMedia] = useState<MediaStream | null>(null);
  const id = sendStream.getId();
  const onVideoResize = useCallback(
    (size) => {
      onResize(size, id);
    },
    [onResize, id]
  );

  useEffect(() => {
    const listener = () => {
      setMedia(sendStream?.getUserMediaStream() ?? null);
    };
    sendStream?.addEventListener("media:change", listener);
    listener();

    return (): void => {
      sendStream?.removeEventListener("media:change", listener);
    };
  }, [sendStream]);

  return {
    video: useVideo({
      media,
      muted: true,
      flip: !sendStream?.isScreenShareEnabled(),
      onResize: onVideoResize,
    }),
  };
}
