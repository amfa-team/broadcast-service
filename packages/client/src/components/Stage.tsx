import React from "react";
import Video from "./Video";
import { types } from "mediasoup-client";
import useRecvStreams from "../hooks/useRecvStreams";

type StageProps = {
  device: types.Device;
  userId: string;
};

export default function Stage(props: StageProps): JSX.Element {
  const { streams } = useRecvStreams(props.userId, props.device);

  return (
    <div>
      {Object.values(streams).map((stream) => {
        return (
          <Video key={stream.id} stream={stream} muted={false} flip={false} />
        );
      })}
    </div>
  );
}
