import React from "react";
import RecvStream from "../../../../../sdk/stream/RecvStream";
import { useRecvStreamControls } from "./useRecvStreamControls";
import { RecvStreamControls } from "./RecvStreamControls";

export interface RecvControlsProps {
  stream: RecvStream;
}

export function RecvStreamControlsContainer(
  props: RecvControlsProps
): JSX.Element {
  const controlsProps = useRecvStreamControls(props.stream);

  return <RecvStreamControls {...controlsProps} />;
}
