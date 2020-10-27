import { createStyles, makeStyles } from "@material-ui/core/styles";
import { PermDataSetting, SignalCellularConnectedNoInternet0Bar, } from "@material-ui/icons";
import React from "react";
const useStyles = makeStyles((theme) => createStyles({
    root: {
        margin: theme.spacing(1),
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));
function getStatusIcon(state) {
    switch (state) {
        case "initial":
        case "creating":
        case "connecting":
            return React.createElement(PermDataSetting, null);
        case "connected":
            return null;
        default:
            return React.createElement(SignalCellularConnectedNoInternet0Bar, { color: "secondary" });
    }
}
export function SendStreamStatus(props) {
    const { state } = props;
    const classes = useStyles();
    return React.createElement("div", { className: classes.root }, getStatusIcon(state));
}
//# sourceMappingURL=SendStreamStatus.js.map