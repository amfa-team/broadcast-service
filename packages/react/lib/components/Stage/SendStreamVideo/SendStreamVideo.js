import React from "react";
import { Video } from "../Video";
import { SendStreamOverlay } from "./SendStreamOverlay";
export function SendStreamVideo(props) {
    return (React.createElement(Video, Object.assign({}, props.video),
        React.createElement(SendStreamOverlay, Object.assign({}, props.overlay))));
}
//# sourceMappingURL=SendStreamVideo.js.map