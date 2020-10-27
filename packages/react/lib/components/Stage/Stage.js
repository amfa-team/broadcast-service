import { Box } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import { RecvStream } from "../../sdk/stream/RecvStream";
import { Controls } from "./Controls";
import { RecvStreamVideoContainer } from "./RecvStreamVideo";
import { SendStreamControls } from "./SendStreamControls";
import { SendStreamVideoContainer } from "./SendStreamVideo";
import { StageGrid } from "./StageGrid/StageGrid";
const useStyles = makeStyles(createStyles({
    root: {
        position: "relative",
        height: "100%",
        width: "100%",
    },
    gridWithControls: {
        position: "relative",
        height: "100%",
        width: "100%",
        paddingBottom: "100px",
    },
    gridWithoutControls: {
        position: "relative",
        height: "100%",
        width: "100%",
        paddingBottom: "10px",
    },
}));
export function Stage(props) {
    const classes = useStyles();
    const { recvStreams, sendStream, onResize, sizes, controls, extraControls, setMain, state, } = props;
    const elements = [...recvStreams];
    if (sendStream !== null) {
        elements.push(sendStream);
    }
    return (React.createElement("div", { className: classes.root },
        React.createElement(Box, { className: controls || extraControls.length > 0
                ? classes.gridWithControls
                : classes.gridWithoutControls },
            React.createElement(StageGrid, { sizes: sizes }, elements.map((stream, i) => {
                if (stream instanceof RecvStream) {
                    return (React.createElement(RecvStreamVideoContainer, { key: stream.getId(), recvStream: stream, onResize: onResize, isMain: i === 0, setMain: setMain, state: state }));
                }
                return (React.createElement(SendStreamVideoContainer, { key: stream.getId(), sendStream: stream, onResize: onResize, state: state }));
            }))),
        controls ? (React.createElement(SendStreamControls, Object.assign({}, controls, { extraControls: extraControls }))) : (React.createElement(Controls, { controls: extraControls }))));
}
//# sourceMappingURL=Stage.js.map