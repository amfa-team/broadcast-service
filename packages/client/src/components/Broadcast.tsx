import React from "react";
import SendControls from "./SendControls";
import Video from "./Video";
import useBroadcast from "../hooks/useBroadcast";
import { Picnic } from "../sdk/sdk";
import useBroadcastMedia from "../hooks/useBroadcastMedia";

type BroadcastProps = {
  sdk: Picnic;
};

export default function Broadcast(props: BroadcastProps): JSX.Element {
  const { stream, info } = useBroadcast(props.sdk);
  const { media } = useBroadcastMedia(stream);

  if (stream === null) {
    return <div>{info}</div>;
  }

  return (
    <div>
      <SendControls stream={stream} />
      {info !== null ? <div>{info}</div> : null}
      <Video stream={media} muted flip={!stream.isScreenShareEnabled()} />
    </div>
  );
}
