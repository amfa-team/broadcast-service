import React from "react";
import SendStream from "../sdk/stream/SendStream";
import useSendStreamControls from "../hooks/useSendStreamControls";

type ControlsProps = {
  stream: SendStream;
};

export default function SendControls(props: ControlsProps): JSX.Element {
  const {
    audioPaused,
    videoPaused,
    pauseAudio,
    pauseVideo,
  } = useSendStreamControls(props.stream);
  const toggleAudio = (): void => {
    pauseAudio(!audioPaused);
  };
  const toggleVideo = (): void => {
    pauseVideo(!videoPaused);
  };

  return (
    <div>
      <button onClick={toggleAudio}>Mic {audioPaused ? "On" : "Off"}</button>
      <button onClick={toggleVideo}>Cam {videoPaused ? "On" : "Off"}</button>
    </div>
  );
}
