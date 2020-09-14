import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { SendStreamStatus, UseSendStreamStatus } from "./SendStreamStatus";
import { Box } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "relative",
      width: "100%",
      height: "56px",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    status: {
      zIndex: 10,
      width: "100%",
      position: "absolute",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-start",
      color: theme.palette.info.light,
    },
  })
);

export function SendStreamOverlay(props: UseSendStreamStatus): JSX.Element {
  const { state } = props;
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <div className={classes.status}>
        <SendStreamStatus state={state} />
      </div>
    </Box>
  );
}
