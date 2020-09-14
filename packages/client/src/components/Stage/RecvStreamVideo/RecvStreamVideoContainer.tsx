import React from "react";
import {
  useRecvStreamVideo,
  UseRecvStreamVideoParams,
} from "./useRecvStreamVideo";
import { RecvStreamVideo } from "./RecvStreamVideo";

export function RecvStreamVideoContainer(
  props: UseRecvStreamVideoParams
): JSX.Element {
  const componentProps = useRecvStreamVideo(props);
  return <RecvStreamVideo {...componentProps} />;
}
