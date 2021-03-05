import React from "react";
import { useAudio } from "./useAudio";
import type { AudioProps } from "./useAudio";

export function Audio(props: AudioProps) {
  const { muted, refAudio } = useAudio(props);
  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <audio ref={refAudio} muted={muted} />;
}
Audio.defaultProps = {
  muted: false,
};
