import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import type { UseSendStreamControls } from "./useSendStreamControls";
import {
  MicOff,
  Mic,
  Videocam,
  VideocamOff,
  Airplay,
  DesktopAccessDisabled,
} from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: 0,
      left: 0,
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
    audioPaused,
    videoPaused,
    isScreenShareEnabled,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
  } = props;

  return (
    <div className={classes.root}>
      <Fab onClick={toggleAudio}>{audioPaused ? <MicOff /> : <Mic />}</Fab>
      <Fab onClick={toggleVideo}>
        {videoPaused ? <VideocamOff /> : <Videocam />}
      </Fab>
      <Fab onClick={toggleScreenShare}>
        {isScreenShareEnabled ? <DesktopAccessDisabled /> : <Airplay />}
      </Fab>
    </div>
  );
}
