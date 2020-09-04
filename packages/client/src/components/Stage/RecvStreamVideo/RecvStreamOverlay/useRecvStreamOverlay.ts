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

export function useRecvStreamOverlay(stream: RecvStream): UseRecvStreamOverlay {
  return {
    controls: useRecvStreamControls(stream),
    status: useRecvStreamStatus(stream),
  };
}
