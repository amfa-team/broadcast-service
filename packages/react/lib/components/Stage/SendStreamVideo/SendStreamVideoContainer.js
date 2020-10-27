import React from "react";
import { SendStreamVideo } from "./SendStreamVideo";
import { useSendStreamVideo } from "./useSendStreamVideo";
export function SendStreamVideoContainer(props) {
    const controlProps = useSendStreamVideo(props);
    return React.createElement(SendStreamVideo, Object.assign({}, controlProps));
}
//# sourceMappingURL=SendStreamVideoContainer.js.map