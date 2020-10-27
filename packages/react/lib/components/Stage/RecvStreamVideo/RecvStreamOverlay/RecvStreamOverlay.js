import { Box } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import { RecvStreamControls } from "./RecvStreamControls";
import { RecvStreamStatus } from "./RecvStreamStatus";
const useStyles = makeStyles((theme) => createStyles({
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
}));
export function RecvStreamOverlay(props) {
    const { controls, status } = props;
    const classes = useStyles();
    return (React.createElement(Box, { className: classes.root },
        React.createElement("div", { className: classes.status },
            React.createElement(RecvStreamStatus, Object.assign({}, status))),
        React.createElement("div", { className: classes.controls },
            React.createElement(RecvStreamControls, Object.assign({}, controls)))));
}
//# sourceMappingURL=RecvStreamOverlay.js.map