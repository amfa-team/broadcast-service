import { useCallback } from "react";
import type { RecvStream } from "../../../sdk/stream/RecvStream";
import type { SDKState } from "../../../types";
import type { Size } from "../StageGrid/layout";
import { useVideo } from "../Video";
import type { UseVideo } from "../Video";
import { useRecvStreamOverlay } from "./RecvStreamOverlay";
import type { UseRecvStreamOverlay } from "./RecvStreamOverlay";

export interface UseRecvStreamVideo {
  overlay: UseRecvStreamOverlay;
  video: UseVideo;
  id: string;
}

export interface UseRecvStreamVideoParams {
  recvStream: RecvStream;
  onResize: (size: Size, id: string) => void;
  setMain: (id: string) => void;
  isMain: boolean;
  state: SDKState;
}

export function useRecvStreamVideo({
  recvStream,
  onResize,
  setMain,
  isMain,
  state,
}: UseRecvStreamVideoParams): UseRecvStreamVideo {
  const id = recvStream.getId();
  const onVideoResize = useCallback(
    (size) => {
      onResize(size, id);
    },
    [onResize, id],
  );
  return {
    overlay: useRecvStreamOverlay({
      recvStream,
      setMain,
      isMain,
      state: state.recvTransport,
    }),
    video: useVideo({
      media: recvStream.getMediaStream(),
      muted: false,
      flip: false,
      onResize: onVideoResize,
    }),
    id: recvStream.getId(),
  };
}
