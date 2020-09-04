import React from "react";
import { Video } from "../Video";
import { UseSendStreamVideo } from "./useSendStreamVideo";

export function SendStreamVideo(props: UseSendStreamVideo): JSX.Element {
  return <Video {...props.video}></Video>;
}
