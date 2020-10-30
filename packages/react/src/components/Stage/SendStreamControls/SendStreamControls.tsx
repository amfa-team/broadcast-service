import {
  Mic,
  MicOff,
  PortableWifiOffOutlined,
  ScreenShareOutlined,
  StopScreenShareOutlined,
  Videocam,
  VideocamOff,
  WifiTetheringOutlined,
} from "@material-ui/icons";
import React from "react";
import { Controls } from "../Controls";
import type { UseSendStreamControls } from "./useSendStreamControls";

export function SendStreamControls(props: UseSendStreamControls): JSX.Element {
  const {
    active,
    audioPaused,
    videoPaused,
    isScreenShareEnabled,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    toggleActive,
    extraControls,
  } = props;

  if (!active) {
    return (
      <Controls
        controls={[
          {
            name: "broadcast",
            icon: <WifiTetheringOutlined />,
            onClick: toggleActive,
          },
          ...extraControls,
        ]}
      />
    );
  }

  return (
    <Controls
      controls={[
        {
          name: "audio",
          icon: audioPaused ? <MicOff color="secondary" /> : <Mic />,
          onClick: toggleAudio,
        },
        {
          name: "video",
          icon: videoPaused ? <VideocamOff color="secondary" /> : <Videocam />,
          onClick: toggleVideo,
        },
        {
          name: "screenShare",
          icon: isScreenShareEnabled ? (
            <StopScreenShareOutlined />
          ) : (
            <ScreenShareOutlined />
          ),
          onClick: toggleScreenShare,
        },
        ...extraControls,
        {
          name: "stop",
          icon: <PortableWifiOffOutlined />,
          onClick: toggleActive,
          color: "secondary",
        },
      ]}
    />
  );
}
