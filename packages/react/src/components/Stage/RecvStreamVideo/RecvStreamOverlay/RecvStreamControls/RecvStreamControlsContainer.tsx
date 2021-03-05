import React from "react";
import { RecvStreamControls } from "./RecvStreamControls";
import type { UseRecvStreamControlsParams } from "./useRecvStreamControls";
import { useRecvStreamControls } from "./useRecvStreamControls";

export function RecvStreamControlsContainer(
  props: UseRecvStreamControlsParams,
): JSX.Element {
  const controlsProps = useRecvStreamControls(props);

  return <RecvStreamControls {...controlsProps} />;
}
