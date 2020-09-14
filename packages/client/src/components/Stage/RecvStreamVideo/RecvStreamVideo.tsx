import React from "react";
import { Video } from "../Video";
import { RecvStreamOverlay } from "./RecvStreamOverlay";
import { UseRecvStreamVideo } from "./useRecvStreamVideo";

export function RecvStreamVideo(props: UseRecvStreamVideo): JSX.Element {
  return (
    <Video {...props.video}>
      <RecvStreamOverlay {...props.overlay} />
    </Video>
  );
}
