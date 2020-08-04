import React from "react";
import Video from "./Video";
import useRecvStreams from "../hooks/useRecvStreams";
import { SDK } from "../types";

type StageProps = {
  sdk: SDK;
};

export default function Stage(props: StageProps): JSX.Element {
  const { streams } = useRecvStreams(props.sdk);

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
