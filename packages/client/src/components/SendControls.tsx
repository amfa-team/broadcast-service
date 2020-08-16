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
    startScreenShare,
    isScreenShareEnabled,
    stopScreenShare,
  } = useSendStreamControls(props.stream);
  const toggleAudio = (): void => {
    pauseAudio(!audioPaused);
  };
  const toggleVideo = (): void => {
    pauseVideo(!videoPaused);
  };
  const toggleShare = (): void => {
    isScreenShareEnabled ? stopScreenShare() : startScreenShare();
  };

  return (
    <div>
      <button onClick={toggleAudio}>Mic {audioPaused ? "On" : "Off"}</button>
      <button onClick={toggleVideo}>Cam {videoPaused ? "On" : "Off"}</button>
      <button onClick={toggleShare}>
        {isScreenShareEnabled ? "Stop" : "Start"}Screen Share
      </button>
    </div>
  );
}
