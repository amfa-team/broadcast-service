import React, { useState, useCallback } from "react";
import { Broadcast, useSDK, Stage } from "../../src";
import { useParams } from "react-router-dom";
import { useApi } from "./useApi";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: "100%",
      height: "100%",
      textAlign: "center",
    },
  })
);

export default function BroadcastPage(): JSX.Element {
  const classes = useStyles();
  const { token } = useParams();
  const endpoint = useApi().ws;
  const settings = { endpoint, token };
  const [stopped, setStopped] = useState(false);

  const state = useSDK(settings);
  const onToggleStop = useCallback(() => {
    setStopped(!stopped);
  }, [stopped]);

  if (!state.loaded) {
    return (
      <Box className={classes.container}>
        <CircularProgress />
      </Box>
    );
  }

  if (stopped) {
    return (
      <Box className={classes.container}>
        Stopped <button onClick={onToggleStop}>Restart</button>
      </Box>
    );
  }

  return (
    <Box className={classes.container}>
      <div>
        <button onClick={onToggleStop}>Stop</button>
      </div>
      <Broadcast sdk={state.sdk} />
      <Stage sdk={state.sdk} />
    </Box>
  );
}
