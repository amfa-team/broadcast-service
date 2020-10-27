import type { Ref } from "react";
import type { Size } from "../StageGrid/layout";
export declare type VideoProps = {
    media: MediaStream | null | string;
    muted: boolean;
    flip: boolean;
    onResize: (size: Size) => void;
};
export interface UseVideo {
    isPlaying: boolean;
    isLoading: boolean;
    muted: boolean;
    flip: boolean;
    refVideo: Ref<HTMLVideoElement>;
}
export declare function useVideo({ media, flip, muted, onResize, }: VideoProps): UseVideo;
//# sourceMappingURL=useVideo.d.ts.map