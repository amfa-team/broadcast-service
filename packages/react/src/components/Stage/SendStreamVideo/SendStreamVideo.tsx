import React from "react";
import { Video } from "../Video";
import { SendStreamOverlay } from "./SendStreamOverlay";
import type { UseSendStreamVideo } from "./useSendStreamVideo";

export function SendStreamVideo(props: UseSendStreamVideo): JSX.Element {
  return (
    <Video {...props.video}>
      <SendStreamOverlay {...props.overlay} />
    </Video>
  );
}
