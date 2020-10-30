import { captureException } from "@sentry/react";
import type { Ref } from "react";
import { useEffect, useRef, useState } from "react";
import type { Size } from "../StageGrid/layout";

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
    setIsLoading(true);

    const ref = refVideo.current;
    if (ref === null || media === null) {
      return () => {
        // no-op
      };
    }

    const autoPlay = () => {
      document.removeEventListener("click", autoPlay);

      ref.addEventListener("resize", () => {
        onResize({
          height: refVideo.current?.videoHeight ?? 0,
          width: refVideo.current?.videoWidth ?? 0,
        });
      });
      onResize({
        height: ref.videoHeight,
        width: ref.videoWidth,
      });
      ref
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
    };

    if (typeof media === "string") {
      ref.src = media;
    } else {
      ref.srcObject = media;
    }
    ref.onloadedmetadata = autoPlay;

    return () => {
      document.removeEventListener("click", autoPlay);
    };
  }, [media, onResize]);

  return { refVideo, flip, muted, isLoading, isPlaying };
}
