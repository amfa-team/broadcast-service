import { useRecvStreamControls } from "./RecvStreamControls";
import { useRecvStreamStatus } from "./RecvStreamStatus";
export function useRecvStreamOverlay(params) {
    return {
        controls: useRecvStreamControls(params),
        status: useRecvStreamStatus(params.recvStream, params.state),
    };
}
//# sourceMappingURL=useRecvStreamOverlay.js.map