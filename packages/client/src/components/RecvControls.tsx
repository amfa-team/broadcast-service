import React from "react";
import RecvStream from "../sdk/stream/RecvStream";
import useRecvStreamControls from "../hooks/useRecvStreamControls";

type ControlsProps = {
  stream: RecvStream;
};

export default function RecvControls(props: ControlsProps): JSX.Element {
  const {
    audioPaused,
    videoPaused,
    pauseAudio,
    pauseVideo,
  } = useRecvStreamControls(props.stream);
  const toggleAudio = (): void => {
    pauseAudio(!audioPaused);
  };
  const toggleVideo = (): void => {
    pauseVideo(!videoPaused);
  };

  return (
    <div>
      <button onClick={toggleAudio}>Audio {audioPaused ? "On" : "Off"}</button>
      <button onClick={toggleVideo}>Video {videoPaused ? "On" : "Off"}</button>
    </div>
  );
}
