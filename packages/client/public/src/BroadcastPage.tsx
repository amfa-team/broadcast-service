import React from "react";
import { useSDK, StageContainer } from "../../src";
import { useParams } from "react-router-dom";
import { useApi } from "./useApi";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Forum } from "@material-ui/icons";

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

  const state = useSDK(settings);

  if (!state.loaded) {
    return (
      <Box className={classes.container}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <StageContainer
      sdk={state.sdk}
      broadcastEnabled
      extraControls={[
        { name: "chat", onClick: () => console.log("chat"), icon: <Forum /> },
      ]}
    />
  );
}
