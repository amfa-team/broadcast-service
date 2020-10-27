import { Box, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";
import React from "react";
const useStyles = makeStyles((theme) => {
    return createStyles({
        root: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            height: "100%",
            width: "100%",
            flex: 1,
        },
        video: {
            width: "100%",
            height: "100%",
            maxHeight: "100vh",
            borderRadius: "5px",
            transform: (props) => (props.flip ? "scaleX(-1)" : ""),
            objectFit: "contain",
        },
        hidden: {
            width: "100%",
            borderRadius: "5px",
            position: "absolute",
            visibility: "hidden",
            height: "100%",
            zIndex: -1,
        },
        overlay: {
            position: "absolute",
            borderRadius: "5px",
            zIndex: 20,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: theme.palette.info.main,
        },
        children: {
            position: "absolute",
            borderRadius: "5px",
            zIndex: 5,
            width: "100%",
            height: "100%",
        },
    });
});
export function Video(props) {
    const { flip, muted, isPlaying, isLoading, refVideo, children } = props;
    const classes = useStyles({ flip });
    return (React.createElement(Box, { className: classes.root },
        !isPlaying && !isLoading && (React.createElement("div", { className: classes.overlay },
            React.createElement(Typography, { variant: "h5" }, "Click to start"))),
        !isLoading && children != null && (React.createElement("div", { className: classes.children }, children)),
        isLoading && React.createElement(Skeleton, { variant: "rect" }),
        React.createElement("video", { className: !isLoading ? classes.video : classes.hidden, ref: refVideo, muted: muted })));
}
//# sourceMappingURL=Video.js.map