import { types } from "mediasoup-client";
import useUserMedia from "./useUserMedia";
import { useTransport } from "./useTransport";
import { useEffect, useState, useCallback, useDebugValue } from "react";
import { sendStream } from "../sdk/sfuClient";
import { Settings } from "../types";

type UseBroadcast = {
  error: null | string;
  stream: null | MediaStream;
  audioPaused: boolean;
  videoPaused: boolean;
  pause: (audio: boolean, video: boolean) => void;
};

export default function useBroadcast(
  settings: Settings,
  device: types.Device
): UseBroadcast {
  const { stream, error } = useUserMedia();
  const transport = useTransport(settings, device, "send");
  const [videoProducer, setVideoProducer] = useState<types.Producer | null>(
    null
  );
  const [audioProducer, setAudioProducer] = useState<types.Producer | null>(
    null
  );
  const [ready, setReady] = useState(false);
  const [audioPaused, setAudioPaused] = useState(
    audioProducer?.paused ?? false
  );
  const [videoPaused, setVideoPaused] = useState(
    videoProducer?.paused ?? false
  );

  useDebugValue({ videoPaused, audioPaused, audioProducer, videoProducer });

  const pause = useCallback(
    (audio: boolean, video: boolean) => {
      if (audioProducer && audioProducer.paused !== audio) {
        if (audio) {
          audioProducer.pause();
        } else {
          audioProducer.resume();
        }
      }
      if (videoProducer && videoProducer.paused !== video) {
        if (video) {
          videoProducer.pause();
        } else {
          videoProducer.resume();
        }
      }
      setAudioPaused(audio);
      setVideoPaused(video);
    },
    [audioProducer, videoProducer]
  );

  useEffect(() => {
    if (transport && stream) {
      sendStream(transport, stream)
        .then(({ audio, video }) => {
          setReady(true);
          setVideoProducer(video);
          setAudioProducer(audio);
        })
        .catch(console.error);
    }

    return (): void => {
      if (videoProducer) {
        videoProducer.close();
      }
      if (audioProducer) {
        audioProducer.close();
      }
    };
  }, [stream, transport]);

  return {
    error,
    stream: ready ? stream : null,
    audioPaused,
    videoPaused,
    pause,
  };
}
