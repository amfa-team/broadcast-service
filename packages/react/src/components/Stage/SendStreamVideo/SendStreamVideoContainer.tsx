import React from "react";
import { SendStreamVideo } from "./SendStreamVideo";
import type { UseSendStreamVideoParams } from "./useSendStreamVideo";
import { useSendStreamVideo } from "./useSendStreamVideo";

export function SendStreamVideoContainer(
  props: UseSendStreamVideoParams,
): JSX.Element {
  const controlProps = useSendStreamVideo(props);

  return <SendStreamVideo {...controlProps} />;
}
