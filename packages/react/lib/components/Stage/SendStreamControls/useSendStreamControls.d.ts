import type SendStream from "../../../sdk/stream/SendStream";
import type { ControlElement } from "../Controls";
export interface UseSendStreamControls {
    active: boolean;
    audioPaused: boolean;
    videoPaused: boolean;
    toggleActive: () => void;
    toggleAudio: () => void;
    toggleVideo: () => void;
    toggleScreenShare: () => void;
    isScreenShareEnabled: boolean;
    extraControls: ControlElement[];
}
export interface UseSendStreamControlsParams {
    stream: SendStream | null;
    toggleActive: () => void;
    extraControls?: ControlElement[] | null;
}
export default function useSendStreamControls({ stream, toggleActive, extraControls, }: UseSendStreamControlsParams): UseSendStreamControls;
//# sourceMappingURL=useSendStreamControls.d.ts.map