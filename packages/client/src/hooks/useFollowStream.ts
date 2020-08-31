import RecvStream from "../sdk/stream/RecvStream";
import { useEffect, useState } from "react";
import { RecvStreamEventMap } from "../sdk/events/event";
import { ConsumerState } from "../../../types";

type UseFollowStream = {
  stream: MediaStream;
  videoState: ConsumerState;
  audioState: ConsumerState;
};

export default function useFollowStream(stream: RecvStream): UseFollowStream {
  const media = stream.getMediaStream();
  const [audioState, setAudioState] = useState<ConsumerState>(
    stream.getAudioState()
  );
  const [videoState, setVideoState] = useState<ConsumerState>(
    stream.getVideoState()
  );

  useEffect(() => {
    stream.resume();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listener: any = (event: RecvStreamEventMap["state"]) => {
      const { kind, state } = event.data;
      if (kind === "audio") {
        setAudioState(state);
      } else {
        setVideoState(state);
      }
    };
    stream.addEventListener("state", listener);
    return () => {
      stream.pause();
      stream.removeEventListener("state", listener);
    };
  }, [stream]);

  return { stream: media, videoState, audioState };
}
