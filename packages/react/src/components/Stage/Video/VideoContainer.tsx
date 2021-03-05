import React from "react";
import type { VideoProps } from "./useVideo";
import { useVideo } from "./useVideo";
import { Video } from "./Video";

export function VideoContainer(props: VideoProps): JSX.Element | null {
  const videoProps = useVideo(props);

  return <Video {...videoProps} />;
}
