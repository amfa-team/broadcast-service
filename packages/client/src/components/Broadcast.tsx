import React from "react";
import Controls from "./Controls";
import Video from "./Video";
import { types } from "mediasoup-client";
import useBroadcast from "../hooks/useBroadcast";
import { Settings } from "../types";

type BroadcastProps = {
  device: types.Device;
  settings: Settings;
};

export default function Broadcast(props: BroadcastProps): JSX.Element {
  const { error, stream, pause, audioPaused, videoPaused } = useBroadcast(
    props.settings,
    props.device
  );

  if (error) {
    return <div>{error}</div>;
  }

  if (stream === null) {
    return <div>Please enable Mic/Video</div>;
  }

  return (
    <div>
      <Controls
        pause={pause}
        audioPaused={audioPaused}
        videoPaused={videoPaused}
      />
      <Video stream={stream} muted flip />
    </div>
  );
}
