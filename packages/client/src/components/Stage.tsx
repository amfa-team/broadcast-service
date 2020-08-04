import React from "react";
import Video from "./Video";
import { types } from "mediasoup-client";
import useRecvStreams from "../hooks/useRecvStreams";
import { Settings } from "../types";

type StageProps = {
  device: types.Device;
  settings: Settings;
};

export default function Stage(props: StageProps): JSX.Element {
  const { streams } = useRecvStreams(props.settings, props.device);

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
