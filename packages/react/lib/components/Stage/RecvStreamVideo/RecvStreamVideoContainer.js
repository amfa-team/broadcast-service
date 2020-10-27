import React from "react";
import { RecvStreamVideo } from "./RecvStreamVideo";
import { useRecvStreamVideo } from "./useRecvStreamVideo";
export function RecvStreamVideoContainer(props) {
    const componentProps = useRecvStreamVideo(props);
    return React.createElement(RecvStreamVideo, Object.assign({}, componentProps));
}
//# sourceMappingURL=RecvStreamVideoContainer.js.map