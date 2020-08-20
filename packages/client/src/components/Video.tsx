import React, { useEffect, useRef, useState } from "react";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const refVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (refVideo.current === null || stream === null) {
      return;
    }

    const autoPlay = () => {
      if (refVideo.current) {
        document.removeEventListener("click", autoPlay);

        refVideo.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((e) => {
            if (e.name === "NotAllowedError") {
              document.addEventListener("click", autoPlay, false);
            } else {
              console.error(e);
            }
          });
      }
    };

    refVideo.current.srcObject = stream;
    refVideo.current.onloadedmetadata = autoPlay;

    return () => {
      document.removeEventListener("click", autoPlay);
    };
  }, [stream]);

  return (
    <>
      {!isPlaying && refVideo.current && refVideo.current.readyState > 0 && (
        <div>Click to start</div>
      )}
      <video
        style={{
          transform: flip ? "scaleX(-1)" : undefined,
          width: "500px",
        }}
        ref={refVideo}
        muted={muted}
      />
    </>
  );
}
