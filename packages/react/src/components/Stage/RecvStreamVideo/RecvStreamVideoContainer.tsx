import React from "react";
import { RecvStreamVideo } from "./RecvStreamVideo";
import type { UseRecvStreamVideoParams } from "./useRecvStreamVideo";
import { useRecvStreamVideo } from "./useRecvStreamVideo";

export function RecvStreamVideoContainer(
  props: UseRecvStreamVideoParams,
): JSX.Element {
  const componentProps = useRecvStreamVideo(props);
  return <RecvStreamVideo {...componentProps} />;
}
