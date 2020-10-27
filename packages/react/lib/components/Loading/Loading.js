import { Box, CircularProgress } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
const useStyles = makeStyles(() => createStyles({
    container: {
        width: "100%",
        height: "100%",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
}));
export function Loading() {
    const classes = useStyles();
    return (React.createElement(Box, { className: classes.container },
        React.createElement(CircularProgress, null)));
}
//# sourceMappingURL=Loading.js.map