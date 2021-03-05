import type { RecvStream } from "../../../../sdk/stream/RecvStream";
import type { TransportState } from "../../../../types";
import type { UseRecvStreamControls } from "./RecvStreamControls";
import { useRecvStreamControls } from "./RecvStreamControls";
import type { UseRecvStreamStatus } from "./RecvStreamStatus";
import { useRecvStreamStatus } from "./RecvStreamStatus";

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
  params: UseRecvStreamOverlayParams,
): UseRecvStreamOverlay {
  return {
    controls: useRecvStreamControls(params),
    status: useRecvStreamStatus(params.recvStream, params.state),
  };
}
