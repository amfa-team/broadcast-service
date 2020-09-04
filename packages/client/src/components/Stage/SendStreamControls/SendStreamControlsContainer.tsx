import React from "react";
import SendStream from "../../../sdk/stream/SendStream";
import useSendStreamControls from "./useSendStreamControls";
import { SendStreamControls } from "./SendStreamControls";

export interface SendControlsProps {
  stream: SendStream;
  toggleActive: () => void;
}

export function SendStreamControlsContainer(
  props: SendControlsProps
): JSX.Element {
  const controlProps = useSendStreamControls(props);

  return <SendStreamControls {...controlProps} />;
}
