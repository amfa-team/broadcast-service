import React, { useDebugValue } from "react";

type ControlsProps = {
  audioPaused: boolean;
  videoPaused: boolean;
  pause: (audio: boolean, video: boolean) => void;
};

export default function Controls(props: ControlsProps): JSX.Element {
  useDebugValue(props);

  const toggleAudio = (): void => {
    props.pause(!props.audioPaused, props.videoPaused);
  };
  const toggleVideo = (): void => {
    props.pause(props.audioPaused, !props.videoPaused);
  };

  return (
    <div>
      <button onClick={toggleAudio}>
        Mic {props.audioPaused ? "On" : "Off"}
      </button>
      <button onClick={toggleVideo}>
        Cam {props.videoPaused ? "On" : "Off"}
      </button>
    </div>
  );
}
