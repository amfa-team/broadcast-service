import { Box } from "@material-ui/core";
import type { Theme } from "@material-ui/core/styles";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import { RecvStreamControls } from "./RecvStreamControls";
import { RecvStreamStatus } from "./RecvStreamStatus";
import type { UseRecvStreamOverlay } from ".";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      width: "100%",
      height: "56px",
    },
    controls: {
      position: "absolute",
      width: "100%",
      height: "100%",
      borderRadius: "5px",
      zIndex: 5,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "flex-end",
      color: theme.palette.info.light,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    status: {
      zIndex: 10,
      position: "absolute",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-end",
      color: theme.palette.info.light,
    },
  }),
);

export function RecvStreamOverlay(props: UseRecvStreamOverlay): JSX.Element {
  const { controls, status } = props;
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <div className={classes.status}>
        <RecvStreamStatus {...status} />
      </div>
      <div className={classes.controls}>
        <RecvStreamControls {...controls} />
      </div>
    </Box>
  );
}
