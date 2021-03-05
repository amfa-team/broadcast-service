import React from "react";
import type { RecvStream } from "../../../../../sdk/stream/RecvStream";
import type { TransportState } from "../../../../../types";
import { RecvStreamStatus } from "./RecvStreamStatus";
import { useRecvStreamStatus } from "./useRecvStreamStatus";

export interface RecvStreamStatusContainerProps {
  stream: RecvStream;
  state: TransportState;
}

export function RecvStreamStatusContainer(
  props: RecvStreamStatusContainerProps,
): JSX.Element {
  const statusProps = useRecvStreamStatus(props.stream, props.state);

  return <RecvStreamStatus {...statusProps} />;
}
