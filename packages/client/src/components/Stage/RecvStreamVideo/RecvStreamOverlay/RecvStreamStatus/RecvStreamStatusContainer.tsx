import React from "react";
import RecvStream from "../../../../../sdk/stream/RecvStream";
import { useRecvStreamStatus } from "./useRecvStreamStatus";
import { RecvStreamStatus } from "./RecvStreamStatus";
import { TransportState } from "../../../../../types";

export interface RecvStreamStatusContainerProps {
  stream: RecvStream;
  state: TransportState;
}

export function RecvStreamStatusContainer(
  props: RecvStreamStatusContainerProps
): JSX.Element {
  const statusProps = useRecvStreamStatus(props.stream, props.state);

  return <RecvStreamStatus {...statusProps} />;
}
