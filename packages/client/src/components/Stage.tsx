import React from "react";
import useRecvStreams from "../hooks/useRecvStreams";
import { Picnic } from "../sdk/sdk";
import FollowStream from "./FollowStream";

type StageProps = {
  sdk: Picnic;
};

export default function Stage(props: StageProps): JSX.Element {
  const { streams } = useRecvStreams(props.sdk);

  return (
    <div>
      {streams.map((stream) => {
        return <FollowStream key={stream.getId()} stream={stream} />;
      })}
    </div>
  );
}
