import React, { useEffect, useRef } from "react";

type VideoProps = {
  stream: MediaStream | null;
  muted: boolean;
  flip: boolean;
};

export default function Video({
  stream,
  flip,
  muted,
}: VideoProps): JSX.Element | null {
  const refVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (refVideo.current === null || stream === null) {
      return;
    }
    refVideo.current.srcObject = stream;
    refVideo.current.onloadedmetadata = (): void => {
      if (refVideo.current) refVideo.current.play();
    };
  }, [stream]);

  return (
    <video
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
        width: "500px",
      }}
      ref={refVideo}
      muted={muted}
    />
  );
}
