import React from "react";
import type { UseSendStreamControls } from "./useSendStreamControls";
import {
  MicOff,
  Mic,
  Videocam,
  VideocamOff,
  StopScreenShareOutlined,
  ScreenShareOutlined,
  WifiTetheringOutlined,
  PortableWifiOffOutlined,
} from "@material-ui/icons";
import { Controls } from "../Controls";

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
          icon: audioPaused ? <MicOff /> : <Mic />,
          onClick: toggleAudio,
        },
        {
          name: "video",
          icon: videoPaused ? <VideocamOff /> : <Videocam />,
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
