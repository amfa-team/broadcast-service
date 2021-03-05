import React from "react";
import type SendStream from "../../../sdk/stream/SendStream";
import { SendStreamControls } from "./SendStreamControls";
import useSendStreamControls from "./useSendStreamControls";

export interface SendControlsProps {
  stream: SendStream;
  toggleActive: () => void;
}

export function SendStreamControlsContainer(
  props: SendControlsProps,
): JSX.Element {
  const controlProps = useSendStreamControls(props);

  return <SendStreamControls {...controlProps} />;
}
