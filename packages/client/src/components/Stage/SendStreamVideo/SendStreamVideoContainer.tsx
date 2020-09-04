import React from "react";
import {
  useSendStreamVideo,
  UseSendStreamVideoParams,
} from "./useSendStreamVideo";
import { SendStreamVideo } from "./SendStreamVideo";

export function SendStreamVideoContainer(
  props: UseSendStreamVideoParams
): JSX.Element {
  const controlProps = useSendStreamVideo(props);

  return <SendStreamVideo {...controlProps} />;
}
