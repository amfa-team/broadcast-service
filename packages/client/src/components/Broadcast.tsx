import React from "react";
import Controls from "./Controls";
import Video from "./Video";
import useBroadcast from "../hooks/useBroadcast";
import { Picnic } from "../sdk/sdk";

type BroadcastProps = {
  sdk: Picnic;
};

export default function Broadcast(props: BroadcastProps): JSX.Element {
  const { stream } = useBroadcast(props.sdk);

  if (stream === null) {
    return <div>Please enable Mic/Video</div>;
  }

  return (
    <div>
      <Controls stream={stream} />
      <Video stream={stream.getUserMediaStream()} muted flip />
    </div>
  );
}
