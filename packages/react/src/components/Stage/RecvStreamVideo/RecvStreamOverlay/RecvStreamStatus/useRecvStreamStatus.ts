import type { ConsumerState } from "@amfa-team/broadcast-service-types";
import { useEffect, useState } from "react";
import type {
  RecvStream,
  RecvStreamEvents,
} from "../../../../../sdk/stream/RecvStream";
import type { TransportState } from "../../../../../types";

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
  state: TransportState,
): UseRecvStreamStatus {
  const [audioState, setAudioState] = useState<ConsumerState>(
    stream.getAudioState(),
  );
  const [videoState, setVideoState] = useState<ConsumerState>(
    stream.getVideoState(),
  );
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    stream.resume().catch(setError);

    const listener = (event: RecvStreamEvents["state"]) => {
      const { kind, state: s } = event.data;
      if (kind === "audio") {
        setAudioState(s);
      } else {
        setVideoState(s);
      }
    };
    stream.addEventListener("state", listener);
    setAudioState(stream.getAudioState());
    setVideoState(stream.getVideoState());
    return () => {
      stream.removeEventListener("state", listener);
    };
  }, [stream]);

  const recvQuality = getRecvQuality(videoState) ?? getRecvQuality(audioState);

  if (error) {
    throw error;
  }

  return {
    recvQuality: state !== "connected" ? 0 : recvQuality,
    producerAudioPaused: audioState.producerPaused,
  };
}
