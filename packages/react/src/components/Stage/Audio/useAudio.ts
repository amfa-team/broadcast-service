import { captureException } from "@sentry/react";
import type { Ref } from "react";
import { useEffect, useRef, useState } from "react";

export type AudioProps = {
  media: MediaStream | null | string;
  muted: boolean;
  panningModel: "HRTF" | "equalpower";
  distanceModel: "linear" | "inverse" | "exponential";
  positionX: number;
  positionY: number;
  positionZ: number;
  maxDistance: number;
};

export interface UseAudio {
  isPlaying: boolean;
  isLoading: boolean;
  muted: boolean;
  refAudio: Ref<HTMLAudioElement>;
}

function createPanner(audioElement: HTMLAudioElement) {
  const audioCtx = new AudioContext();
  const { listener } = audioCtx;

  const posX = 100 / 2;
  const posY = 100 / 2;
  const posZ = 300;

  listener.positionX.value = posX;
  listener.positionY.value = posY;
  listener.positionZ.value = posZ - 5;
  listener.forwardX.value = 0;
  listener.forwardY.value = 0;
  listener.forwardZ.value = -1;
  listener.upX.value = 0;
  listener.upY.value = 1;
  listener.upZ.value = 0;

  const pannerModel = "HRTF";

  const innerCone = 40;
  const outerCone = 50;
  const outerGain = 0.4;

  const distanceModel = "linear";

  const maxDistance = 20000;

  const refDistance = 1;

  const rollOff = 10;

  const positionX = posX;
  const positionY = posY;
  const positionZ = posZ;

  const orientationX = 0.0;
  const orientationY = 0.0;
  const orientationZ = -1.0;

  // let's use the class method for creating our panner node and pass in all those parameters we've set.

  const panner = new PannerNode(audioCtx, {
    panningModel: pannerModel,
    distanceModel,
    positionX,
    positionY,
    positionZ,
    orientationX,
    orientationY,
    orientationZ,
    refDistance,
    maxDistance,
    rolloffFactor: rollOff,
    coneInnerAngle: innerCone,
    coneOuterAngle: outerCone,
    coneOuterGain: outerGain,
  });

  const track = audioCtx.createMediaElementSource(audioElement);

  track.connect(panner).connect(audioCtx.destination);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return panner;
}

export function useAudio({
  media,
  muted,
  positionX,
  positionY,
  positionZ,
  distanceModel,
  panningModel,
  maxDistance,
}: AudioProps): UseAudio {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const refAudio = useRef<HTMLAudioElement>(null);
  const [panner, setPanner] = useState<PannerNode | null>(null);

  useEffect(() => {
    if (panner) {
      panner.distanceModel = distanceModel;
      panner.panningModel = panningModel;
      panner.maxDistance = maxDistance || 1;
      panner.positionX.value = positionX || 0;
      panner.positionY.value = positionY || 0;
      panner.positionZ.value = positionZ || 0;
    }
  }, [
    panner,
    maxDistance,
    positionX,
    positionY,
    positionZ,
    distanceModel,
    panningModel,
  ]);

  useEffect(() => {
    setIsLoading(true);

    const ref = refAudio.current;
    if (ref === null || media === null) {
      return () => {
        // no-op
      };
    }

    const autoPlay = () => {
      document.removeEventListener("click", autoPlay);

      ref
        .play()
        .then(() => {
          setIsLoading(false);
          setIsPlaying(true);
          setPanner(createPanner(ref));
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
  }, [media]);

  return { refAudio, muted, isLoading, isPlaying };
}
