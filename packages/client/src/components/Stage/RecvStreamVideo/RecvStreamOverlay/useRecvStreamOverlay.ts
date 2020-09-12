import {
  useRecvStreamControls,
  UseRecvStreamControls,
} from "./RecvStreamControls";
import { useRecvStreamStatus, UseRecvStreamStatus } from "./RecvStreamStatus";
import RecvStream from "../../../../sdk/stream/RecvStream";

export interface UseRecvStreamOverlay {
  controls: UseRecvStreamControls;
  status: UseRecvStreamStatus;
}

export interface UseRecvStreamOverlayParams {
  recvStream: RecvStream;
  setMain: (id: string) => void;
  isMain: boolean;
}

export function useRecvStreamOverlay(
  params: UseRecvStreamOverlayParams
): UseRecvStreamOverlay {
  return {
    controls: useRecvStreamControls(params),
    status: useRecvStreamStatus(params.recvStream),
  };
}
