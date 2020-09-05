import { Ref, useRef, useState, useEffect } from "react";
import { Size } from "../StageGrid/layout";
import { captureException } from "@sentry/react";

export type VideoProps = {
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

export function useVideo({
  media,
  flip,
  muted,
  onResize,
}: VideoProps): UseVideo {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const refVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (refVideo.current === null || media === null) {
      return;
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
            } else {
              captureException(e);
            }
          });
      }
    };

    if (typeof media === "string") {
      refVideo.current.src = media;
    } else {
      refVideo.current.srcObject = media;
    }
    refVideo.current.onloadedmetadata = autoPlay;

    return () => {
      document.removeEventListener("click", autoPlay);
    };
  }, [media, onResize]);

  return { refVideo, flip, muted, isLoading, isPlaying };
}
