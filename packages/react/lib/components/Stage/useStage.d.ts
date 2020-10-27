import type { Picnic } from "../../sdk/sdk";
import type { RecvStream } from "../../sdk/stream/RecvStream";
import type SendStream from "../../sdk/stream/SendStream";
import type { SDKState } from "../../types";
import type { ControlElement } from "./Controls";
import type { UseSendStreamControls } from "./SendStreamControls";
import type { Size } from "./StageGrid/layout";
export interface UseRecvStreams {
    recvStreams: RecvStream[];
    setMain: (id: string) => void;
}
export interface UseSendStream {
    sendStream: SendStream | null;
    controls: UseSendStreamControls | null;
}
export interface UseStageParams {
    sdk: Picnic;
    broadcastEnabled: boolean;
    extraControls?: ControlElement[] | null;
}
export interface UseStage extends UseRecvStreams, UseSendStream {
    onResize: (size: Size, id: string) => void;
    sizes: Size[];
    extraControls: ControlElement[];
    state: SDKState;
}
export declare function useSendStream(sdk: Picnic, enabled: boolean): UseSendStream;
export declare function useRecvStreams(sdk: Picnic): UseRecvStreams;
export declare function useStage({ sdk, extraControls, broadcastEnabled, }: UseStageParams): UseStage;
//# sourceMappingURL=useStage.d.ts.map