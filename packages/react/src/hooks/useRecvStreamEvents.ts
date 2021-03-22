import { useEffect, useState } from "react";
import type { IRecvStream } from "../sdk/stream/RecvStream";

export function useRecvStreamState(recvStream: IRecvStream | null) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(true);

  const [isVideoEnabled, setIsVideoEnabled] = useState(false);

  const [isReady, setIsReady] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const listener = () => {
      setIsAudioEnabled(recvStream?.isAudioEnabled() ?? false);
      setIsAudioPaused(recvStream?.isAudioPaused() ?? true);

      setIsVideoEnabled(recvStream?.isVideoEnabled() ?? false);

      setIsReady(recvStream?.isReady() ?? false);
      setIsReconnecting(recvStream?.isReconnecting() ?? false);
    };

    recvStream?.addEventListener("stream:pause", listener);
    recvStream?.addEventListener("stream:resume", listener);
    recvStream?.addEventListener("state", listener);

    listener();

    return () => {
      recvStream?.removeEventListener("stream:pause", listener);
      recvStream?.removeEventListener("stream:resume", listener);
      recvStream?.removeEventListener("state", listener);
    };
  }, [recvStream]);

  return {
    isAudioPaused,
    isAudioEnabled,

    isVideoEnabled,

    isReady,
    isReconnecting,

    volume: isAudioPaused ? 0 : 100,
  };
}
