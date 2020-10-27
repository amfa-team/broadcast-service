import { Box } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import ReactResizeDetector from "react-resize-detector";
import { getLayout } from "./layout";
const useStyles = makeStyles(createStyles({
    root: {
        position: "relative",
        height: ({ bbox }) => `${bbox.height}px`,
        width: ({ bbox }) => `${bbox.width}px`,
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        flexDirection: ({ layout }) => layout.type === "horizontal" ? "row" : "column",
    },
    main: {
        position: "relative",
        height: ({ layout }) => `${layout.main.height}px`,
        width: ({ layout }) => `${layout.main.width}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    rest: {
        position: "relative",
        display: "flex",
        flexDirection: ({ layout }) => layout.type === "horizontal" ? "column" : "row",
        justifyContent: "center",
        alignItems: "center",
        "& > *": {
            position: "relative",
            height: ({ layout }) => `${layout.rest.height - 4}px`,
            width: ({ layout }) => `${layout.rest.width - 4}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "2px",
        },
    },
}));
export function StageGridFixed(props) {
    const { width, height, children, sizes } = props;
    const bbox = { width, height };
    const layout = getLayout(bbox, Object.values(sizes));
    const classes = useStyles({ layout, bbox });
    const [main = null, ...rest] = React.Children.toArray(children);
    const hasRest = rest.length > 0;
    if (main === null) {
        return null;
    }
    return (React.createElement(Box, { className: classes.root },
        React.createElement(Box, { className: classes.main }, main),
        hasRest && React.createElement(Box, { className: classes.rest }, rest)));
}
export function StageGrid(props) {
    const { children, sizes } = props;
    if (React.Children.count(children) === 0) {
        return null;
    }
    return (React.createElement(ReactResizeDetector, { refreshMode: "debounce", refreshRate: 150 }, ({ width = 0, height = 0, targetRef }) => {
        return (React.createElement("div", { style: { width: "100%", height: "100%", position: "relative" }, ref: targetRef },
            React.createElement(StageGridFixed, { sizes: sizes, width: width, height: height }, children)));
    }));
}
//# sourceMappingURL=StageGrid.js.map