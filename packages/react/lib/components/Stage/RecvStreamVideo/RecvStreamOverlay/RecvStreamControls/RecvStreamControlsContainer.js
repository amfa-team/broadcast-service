import React from "react";
import { RecvStreamControls } from "./RecvStreamControls";
import { useRecvStreamControls } from "./useRecvStreamControls";
export function RecvStreamControlsContainer(props) {
    const controlsProps = useRecvStreamControls(props);
    return React.createElement(RecvStreamControls, Object.assign({}, controlsProps));
}
//# sourceMappingURL=RecvStreamControlsContainer.js.map