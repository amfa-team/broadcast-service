import {
  UseRecvStreamOverlay,
  useRecvStreamOverlay,
} from "./RecvStreamOverlay";
import { UseVideo, useVideo } from "../Video";
import RecvStream from "../../../sdk/stream/RecvStream";
import { Size } from "../StageGrid/layout";
import { useCallback } from "react";

export interface UseRecvStreamVideo {
  overlay: UseRecvStreamOverlay;
  video: UseVideo;
  id: string;
}

export interface UseRecvStreamVideoParams {
  recvStream: RecvStream;
  onResize: (size: Size, id: string) => void;
}

export function useRecvStreamVideo({
  recvStream,
  onResize,
}: UseRecvStreamVideoParams): UseRecvStreamVideo {
  const id = recvStream.getId();
  const onVideoResize = useCallback(
    (size) => {
      onResize(size, id);
    },
    [onResize, id]
  );
  return {
    overlay: useRecvStreamOverlay(recvStream),
    video: useVideo({
      media: recvStream.getMediaStream(),
      muted: false,
      flip: false,
      onResize: onVideoResize,
    }),
    id: recvStream.getId(),
  };
}
