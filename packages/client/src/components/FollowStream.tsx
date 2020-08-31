import React from "react";
import Video from "./Video";
import RecvStream from "../sdk/stream/RecvStream";
import useFollowStream from "../hooks/useFollowStream";
import RecvControls from "./RecvControls";

type FollowStreamProps = {
  stream: RecvStream;
};

export default function FollowStream(props: FollowStreamProps): JSX.Element {
  const { stream, videoState, audioState } = useFollowStream(props.stream);

  return (
    <div>
      <RecvControls stream={props.stream} />
      <div>Audio State: {JSON.stringify(audioState)}</div>
      <div>Video State: {JSON.stringify(videoState)}</div>
      <Video stream={stream} muted={false} flip={false} />
    </div>
  );
}
