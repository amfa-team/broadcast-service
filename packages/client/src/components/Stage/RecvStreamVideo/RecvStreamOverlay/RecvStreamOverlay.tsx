import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { RecvStreamStatus } from "./RecvStreamStatus";
import { Box } from "@material-ui/core";
import { RecvStreamControls } from "./RecvStreamControls";
import { UseRecvStreamOverlay } from ".";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      width: "100%",
      height: "100%",
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
      transition: "opacity .25s ease-in-out .0s",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      opacity: 0,
      "&:hover": {
        opacity: 1,
      },
    },
    status: {
      zIndex: 10,
      position: "absolute",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-end",
      color: theme.palette.info.light,
    },
  })
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
