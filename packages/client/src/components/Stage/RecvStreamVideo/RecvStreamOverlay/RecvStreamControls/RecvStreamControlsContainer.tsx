import React from "react";
import {
  useRecvStreamControls,
  UseRecvStreamControlsParams,
} from "./useRecvStreamControls";
import { RecvStreamControls } from "./RecvStreamControls";

export function RecvStreamControlsContainer(
  props: UseRecvStreamControlsParams
): JSX.Element {
  const controlsProps = useRecvStreamControls(props);

  return <RecvStreamControls {...controlsProps} />;
}
