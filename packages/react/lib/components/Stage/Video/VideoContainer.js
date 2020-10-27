import React from "react";
import { useVideo } from "./useVideo";
import { Video } from "./Video";
export function VideoContainer(props) {
    const videoProps = useVideo(props);
    return React.createElement(Video, Object.assign({}, videoProps));
}
//# sourceMappingURL=VideoContainer.js.map