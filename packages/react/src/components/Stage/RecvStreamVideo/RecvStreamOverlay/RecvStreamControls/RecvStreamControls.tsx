import type { Theme } from "@material-ui/core/styles";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
  SettingsOverscan,
  Videocam,
  VideocamOff,
  VolumeOff,
  VolumeUp,
} from "@material-ui/icons";
import React from "react";
import type { UseRecvStreamControls } from "./useRecvStreamControls";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    icon: {
      "&:hover": {
        cursor: "pointer",
      },
    },
  }),
);

export function RecvStreamControls(props: UseRecvStreamControls): JSX.Element {
  const {
    audioPaused,
    videoPaused,
    toggleAudio,
    toggleVideo,
    maximize,
  } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {videoPaused ? (
        <VideocamOff
          className={classes.icon}
          onClick={toggleVideo}
          color="secondary"
        />
      ) : (
        <Videocam className={classes.icon} onClick={toggleVideo} />
      )}
      {audioPaused ? (
        <VolumeOff
          className={classes.icon}
          onClick={toggleAudio}
          color="secondary"
        />
      ) : (
        <VolumeUp className={classes.icon} onClick={toggleAudio} />
      )}
      {maximize && (
        <SettingsOverscan className={classes.icon} onClick={maximize} />
      )}
    </div>
  );
}