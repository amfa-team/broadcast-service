import { Fab } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
const useStyles = makeStyles((theme) => createStyles({
    root: {
        position: "absolute",
        bottom: theme.spacing(2),
        right: 0,
        left: 0,
        zIndex: 100,
        textAlign: "center",
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));
export function Controls(props) {
    const classes = useStyles();
    const { controls } = props;
    return (React.createElement("div", { className: classes.root }, controls.map(({ name, icon, onClick, color }) => (React.createElement(Fab, { key: name, onClick: onClick, color: color }, icon)))));
}
//# sourceMappingURL=Controls.js.map