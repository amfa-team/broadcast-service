import type { Theme } from "@material-ui/core/styles";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
  PermDataSetting,
  SignalCellularConnectedNoInternet0Bar,
} from "@material-ui/icons";
import React from "react";
import type { TransportState } from "../../../../../types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  }),
);

export interface UseSendStreamStatus {
  state: TransportState;
}

function getStatusIcon(state: TransportState): JSX.Element | null {
  switch (state) {
    case "initial":
    case "creating":
    case "connecting":
      return <PermDataSetting />;
    case "connected":
      return null;
    default:
      return <SignalCellularConnectedNoInternet0Bar color="secondary" />;
  }
}

export function SendStreamStatus(props: UseSendStreamStatus): JSX.Element {
  const { state } = props;
  const classes = useStyles();

  return <div className={classes.root}>{getStatusIcon(state)}</div>;
}
