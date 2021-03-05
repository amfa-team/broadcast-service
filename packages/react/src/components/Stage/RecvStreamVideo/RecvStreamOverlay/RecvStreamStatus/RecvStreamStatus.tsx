import type { Theme } from "@material-ui/core/styles";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
  MicOff,
  SignalCellular3Bar,
  SignalCellular4Bar,
  SignalCellularConnectedNoInternet0Bar,
  SignalCellularConnectedNoInternet1Bar,
  SignalCellularConnectedNoInternet2Bar,
} from "@material-ui/icons";
import React from "react";
import type { RecvQuality, UseRecvStreamStatus } from "./useRecvStreamStatus";

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

function getQualityIcon(recvQuality: RecvQuality): JSX.Element | null {
  switch (recvQuality) {
    case 0:
      return <SignalCellularConnectedNoInternet0Bar color="secondary" />;
    case 1:
      return <SignalCellularConnectedNoInternet1Bar color="secondary" />;
    case 2:
      return <SignalCellularConnectedNoInternet2Bar />;
    case 3:
      return <SignalCellular3Bar />;
    case 4:
      return <SignalCellular4Bar />;
    default:
      return null;
  }
}

export function RecvStreamStatus(props: UseRecvStreamStatus): JSX.Element {
  const { recvQuality, producerAudioPaused } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {getQualityIcon(recvQuality)}
      {producerAudioPaused && <MicOff color="secondary" />}
    </div>
  );
}
