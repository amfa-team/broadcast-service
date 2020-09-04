import React from "react";
import RecvStream from "../../../../sdk/stream/RecvStream";
import { RecvStreamOverlay } from "./RecvStreamOverlay";
import { useRecvStreamOverlay } from "./useRecvStreamOverlay";

export interface RecvStreamOverlayContainerProps {
  stream: RecvStream;
}

export function RecvStreamOverlayContainer(
  props: RecvStreamOverlayContainerProps
): JSX.Element {
  const componentProps = useRecvStreamOverlay(props.stream);

  return <RecvStreamOverlay {...componentProps} />;
}
