import React from "react";
import { Video } from "../Video";
import { RecvStreamOverlay } from "./RecvStreamOverlay";
export function RecvStreamVideo(props) {
    return (React.createElement(Video, Object.assign({}, props.video),
        React.createElement(RecvStreamOverlay, Object.assign({}, props.overlay))));
}
//# sourceMappingURL=RecvStreamVideo.js.map