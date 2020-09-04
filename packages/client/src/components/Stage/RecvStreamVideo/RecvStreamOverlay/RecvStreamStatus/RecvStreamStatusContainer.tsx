import React from "react";
import RecvStream from "../../../../../sdk/stream/RecvStream";
import { useRecvStreamStatus } from "./useRecvStreamStatus";
import { RecvStreamStatus } from "./RecvStreamStatus";

export interface RecvStreamStatusContainerProps {
  stream: RecvStream;
}

export function RecvStreamStatusContainer(
  props: RecvStreamStatusContainerProps
): JSX.Element {
  const statusProps = useRecvStreamStatus(props.stream);

  return <RecvStreamStatus {...statusProps} />;
}
