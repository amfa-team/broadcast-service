import React from "react";
import { RecvStreamStatus } from "./RecvStreamStatus";
import { useRecvStreamStatus } from "./useRecvStreamStatus";
export function RecvStreamStatusContainer(props) {
    const statusProps = useRecvStreamStatus(props.stream, props.state);
    return React.createElement(RecvStreamStatus, Object.assign({}, statusProps));
}
//# sourceMappingURL=RecvStreamStatusContainer.js.map