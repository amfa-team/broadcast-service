import React from "react";
import { RecvStreamOverlay } from "./RecvStreamOverlay";
import type { UseRecvStreamOverlayParams } from "./useRecvStreamOverlay";
import { useRecvStreamOverlay } from "./useRecvStreamOverlay";

export function RecvStreamOverlayContainer(
  props: UseRecvStreamOverlayParams,
): JSX.Element {
  const componentProps = useRecvStreamOverlay(props);

  return <RecvStreamOverlay {...componentProps} />;
}
