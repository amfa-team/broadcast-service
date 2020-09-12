import { useEffect, useState } from "react";
import RecvStream, {
  RecvStreamEvents,
} from "../../../../../sdk/stream/RecvStream";
import { ConsumerState } from "../../../../../../../types";
import { TransportState } from "../../../../../types";

export type RecvQuality = 0 | 1 | 2 | 3 | 4 | null;

export interface UseRecvStreamStatus {
  recvQuality: RecvQuality;
  producerAudioPaused: boolean;
}

function getRecvQuality(state: ConsumerState): RecvQuality {
  if (state.paused || state.producerPaused) {
    return null;
  }

  if (state.score <= 0) {
    return 0;
  }

  if (state.score <= 2) {
    return 1;
  }

  if (state.score <= 5) {
    return 2;
  }

  if (state.score <= 8) {
    return 3;
  }

  return 4;
}

export function useRecvStreamStatus(
  stream: RecvStream,
  state: TransportState
): UseRecvStreamStatus {
  const [audioState, setAudioState] = useState<ConsumerState>(
    stream.getAudioState()
  );
  const [videoState, setVideoState] = useState<ConsumerState>(
    stream.getVideoState()
  );

  useEffect(() => {
    stream.resume();

    const listener = (event: RecvStreamEvents["state"]) => {
      const { kind, state } = event.data;
      if (kind === "audio") {
        setAudioState(state);
      } else {
        setVideoState(state);
      }
    };
    stream.addEventListener("state", listener);
    setAudioState(stream.getAudioState());
    setVideoState(stream.getVideoState());
    return () => {
      stream.pause();
      stream.removeEventListener("state", listener);
    };
  }, [stream]);

  const recvQuality = getRecvQuality(videoState) ?? getRecvQuality(audioState);

  return {
    recvQuality: state !== "connected" ? 0 : recvQuality,
    producerAudioPaused: audioState.producerPaused,
  };
}
