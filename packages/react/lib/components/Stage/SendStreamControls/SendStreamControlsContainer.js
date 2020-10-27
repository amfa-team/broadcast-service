import React from "react";
import { SendStreamControls } from "./SendStreamControls";
import useSendStreamControls from "./useSendStreamControls";
export function SendStreamControlsContainer(props) {
    const controlProps = useSendStreamControls(props);
    return React.createElement(SendStreamControls, Object.assign({}, controlProps));
}
//# sourceMappingURL=SendStreamControlsContainer.js.map