import React from "react";
import Video from "./Video";
import RecvStream from "../sdk/stream/RecvStream";
import useFollowStream from "../hooks/useFollowStream";

type FollowStreamProps = {
  stream: RecvStream;
};

export default function FollowStream(props: FollowStreamProps): JSX.Element {
  const { stream } = useFollowStream(props.stream);

  console.log(stream);

  return <Video stream={stream} muted={false} flip={false} />;
}
