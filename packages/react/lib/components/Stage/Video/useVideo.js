import { captureException } from "@sentry/react";
import { useEffect, useRef, useState } from "react";
export function useVideo({ media, flip, muted, onResize, }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const refVideo = useRef(null);
    useEffect(() => {
        if (refVideo.current === null || media === null) {
            return () => {
                // no-op
            };
        }
        const autoPlay = () => {
            if (refVideo.current) {
                document.removeEventListener("click", autoPlay);
                refVideo.current.addEventListener("resize", () => {
                    onResize({
                        height: refVideo.current?.videoHeight ?? 0,
                        width: refVideo.current?.videoWidth ?? 0,
                    });
                });
                onResize({
                    height: refVideo.current.videoHeight,
                    width: refVideo.current.videoWidth,
                });
                refVideo.current
                    .play()
                    .then(() => {
                    setIsLoading(false);
                    setIsPlaying(true);
                })
                    .catch((e) => {
                    setIsLoading(false);
                    if (e.name === "NotAllowedError") {
                        document.addEventListener("click", autoPlay, false);
                    }
                    else {
                        captureException(e);
                    }
                });
            }
        };
        if (typeof media === "string") {
            refVideo.current.src = media;
        }
        else {
            refVideo.current.srcObject = media;
        }
        refVideo.current.onloadedmetadata = autoPlay;
        return () => {
            document.removeEventListener("click", autoPlay);
        };
    }, [media, onResize]);
    return { refVideo, flip, muted, isLoading, isPlaying };
}
//# sourceMappingURL=useVideo.js.map