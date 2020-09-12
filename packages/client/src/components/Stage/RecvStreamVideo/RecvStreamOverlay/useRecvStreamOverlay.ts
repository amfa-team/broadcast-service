import {
  useRecvStreamControls,
  UseRecvStreamControls,
} from "./RecvStreamControls";
import { useRecvStreamStatus, UseRecvStreamStatus } from "./RecvStreamStatus";
import RecvStream from "../../../../sdk/stream/RecvStream";
import { TransportState } from "../../../../types";

export interface UseRecvStreamOverlay {
  controls: UseRecvStreamControls;
  status: UseRecvStreamStatus;
}

export interface UseRecvStreamOverlayParams {
  recvStream: RecvStream;
  setMain: (id: string) => void;
  isMain: boolean;
  state: TransportState;
}

export function useRecvStreamOverlay(
  params: UseRecvStreamOverlayParams
): UseRecvStreamOverlay {
  return {
    controls: useRecvStreamControls(params),
    status: useRecvStreamStatus(params.recvStream, params.state),
  };
}
