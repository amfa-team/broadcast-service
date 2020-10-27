import { createStyles, makeStyles } from "@material-ui/core/styles";
import { MicOff, SignalCellular3Bar, SignalCellular4Bar, SignalCellularConnectedNoInternet0Bar, SignalCellularConnectedNoInternet1Bar, SignalCellularConnectedNoInternet2Bar, } from "@material-ui/icons";
import React from "react";
const useStyles = makeStyles((theme) => createStyles({
    root: {
        margin: theme.spacing(1),
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));
function getQualityIcon(recvQuality) {
    switch (recvQuality) {
        case 0:
            return React.createElement(SignalCellularConnectedNoInternet0Bar, { color: "secondary" });
        case 1:
            return React.createElement(SignalCellularConnectedNoInternet1Bar, { color: "secondary" });
        case 2:
            return React.createElement(SignalCellularConnectedNoInternet2Bar, null);
        case 3:
            return React.createElement(SignalCellular3Bar, null);
        case 4:
            return React.createElement(SignalCellular4Bar, null);
        default:
            return null;
    }
}
export function RecvStreamStatus(props) {
    const { recvQuality, producerAudioPaused } = props;
    const classes = useStyles();
    return (React.createElement("div", { className: classes.root },
        getQualityIcon(recvQuality),
        producerAudioPaused && React.createElement(MicOff, { color: "secondary" })));
}
//# sourceMappingURL=RecvStreamStatus.js.map