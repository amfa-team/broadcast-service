import React from "react";
import { RecvStreamOverlay } from "./RecvStreamOverlay";
import { useRecvStreamOverlay } from "./useRecvStreamOverlay";
export function RecvStreamOverlayContainer(props) {
    const componentProps = useRecvStreamOverlay(props);
    return React.createElement(RecvStreamOverlay, Object.assign({}, componentProps));
}
//# sourceMappingURL=RecvStreamOverlayContainer.js.map