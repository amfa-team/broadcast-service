import { createStyles, makeStyles } from "@material-ui/core/styles";
import { SettingsOverscan, Videocam, VideocamOff, VolumeOff, VolumeUp, } from "@material-ui/icons";
import React from "react";
const useStyles = makeStyles((theme) => createStyles({
    root: {
        margin: theme.spacing(1),
        "& > *": {
            margin: theme.spacing(1),
        },
    },
    icon: {
        "&:hover": {
            cursor: "pointer",
        },
    },
}));
export function RecvStreamControls(props) {
    const { audioPaused, videoPaused, toggleAudio, toggleVideo, maximize, } = props;
    const classes = useStyles();
    return (React.createElement("div", { className: classes.root },
        videoPaused ? (React.createElement(VideocamOff, { className: classes.icon, onClick: toggleVideo, color: "secondary" })) : (React.createElement(Videocam, { className: classes.icon, onClick: toggleVideo })),
        audioPaused ? (React.createElement(VolumeOff, { className: classes.icon, onClick: toggleAudio, color: "secondary" })) : (React.createElement(VolumeUp, { className: classes.icon, onClick: toggleAudio })),
        maximize && (React.createElement(SettingsOverscan, { className: classes.icon, onClick: maximize }))));
}
//# sourceMappingURL=RecvStreamControls.js.map