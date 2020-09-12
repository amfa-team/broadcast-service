import React from "react";
import { UseRecvStreamStatus, RecvQuality } from "./useRecvStreamStatus";
import {
  SignalCellularConnectedNoInternet0Bar,
  SignalCellularConnectedNoInternet1Bar,
  SignalCellularConnectedNoInternet2Bar,
  SignalCellular3Bar,
  SignalCellular4Bar,
  MicOff,
} from "@material-ui/icons";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  })
);

function getQualityIcon(recvQuality: RecvQuality): JSX.Element | null {
  switch (recvQuality) {
    case 0:
      return <SignalCellularConnectedNoInternet0Bar />;
    case 1:
      return <SignalCellularConnectedNoInternet1Bar />;
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
      {producerAudioPaused && <MicOff />}
    </div>
  );
}
