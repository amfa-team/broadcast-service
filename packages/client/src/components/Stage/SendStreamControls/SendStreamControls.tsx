import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: 0,
      left: 0,
      zIndex: 100,
      textAlign: "center",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  })
);

export function SendStreamControls(props: UseSendStreamControls): JSX.Element {
  const classes = useStyles();

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
