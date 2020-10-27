import { Mic, MicOff, PortableWifiOffOutlined, ScreenShareOutlined, StopScreenShareOutlined, Videocam, VideocamOff, WifiTetheringOutlined, } from "@material-ui/icons";
import React from "react";
import { Controls } from "../Controls";
export function SendStreamControls(props) {
    const { active, audioPaused, videoPaused, isScreenShareEnabled, toggleAudio, toggleVideo, toggleScreenShare, toggleActive, extraControls, } = props;
    if (!active) {
        return (React.createElement(Controls, { controls: [
                {
                    name: "broadcast",
                    icon: React.createElement(WifiTetheringOutlined, null),
                    onClick: toggleActive,
                },
                ...extraControls,
            ] }));
    }
    return (React.createElement(Controls, { controls: [
            {
                name: "audio",
                icon: audioPaused ? React.createElement(MicOff, { color: "secondary" }) : React.createElement(Mic, null),
                onClick: toggleAudio,
            },
            {
                name: "video",
                icon: videoPaused ? React.createElement(VideocamOff, { color: "secondary" }) : React.createElement(Videocam, null),
                onClick: toggleVideo,
            },
            {
                name: "screenShare",
                icon: isScreenShareEnabled ? (React.createElement(StopScreenShareOutlined, null)) : (React.createElement(ScreenShareOutlined, null)),
                onClick: toggleScreenShare,
            },
            ...extraControls,
            {
                name: "stop",
                icon: React.createElement(PortableWifiOffOutlined, null),
                onClick: toggleActive,
                color: "secondary",
            },
        ] }));
}
//# sourceMappingURL=SendStreamControls.js.map