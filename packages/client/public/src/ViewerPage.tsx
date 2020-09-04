import React from "react";
import { useSDK, StageContainer } from "../../src";
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

export default function ViewerPage(): JSX.Element {
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

  return <StageContainer sdk={state.sdk} broadcastEnabled={false} />;
}
