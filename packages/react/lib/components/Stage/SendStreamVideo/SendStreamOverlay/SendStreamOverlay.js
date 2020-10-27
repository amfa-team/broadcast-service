import { Box } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import { SendStreamStatus } from "./SendStreamStatus";
const useStyles = makeStyles((theme) => createStyles({
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
}));
export function SendStreamOverlay(props) {
    const { state } = props;
    const classes = useStyles();
    return (React.createElement(Box, { className: classes.root },
        React.createElement("div", { className: classes.status },
            React.createElement(SendStreamStatus, { state: state }))));
}
//# sourceMappingURL=SendStreamOverlay.js.map