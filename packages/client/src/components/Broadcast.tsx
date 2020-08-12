import React from "react";
import Controls from "./Controls";
import Video from "./Video";
import useBroadcast from "../hooks/useBroadcast";
import { SDK } from "../types";

type BroadcastProps = {
  sdk: SDK;
};

export default function Broadcast(props: BroadcastProps): JSX.Element {
  const { error, stream, pause, audioPaused, videoPaused } = useBroadcast(
    props.sdk
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
