import React from "react";
import useRecvStreams from "../hooks/useRecvStreams";
import { Picnic } from "../sdk/sdk";
import FollowStream from "./FollowStream";

type StageProps = {
  sdk: Picnic;
};

export default function Stage(props: StageProps): JSX.Element {
  const { streams, info } = useRecvStreams(props.sdk);

  return (
    <div>
      {info !== null ? <div>{info}</div> : null}
      {streams.map((stream) => {
        return <FollowStream key={stream.getId()} stream={stream} />;
      })}
    </div>
  );
}
