import { useEffect, useState } from "react";
import type { ISendStream } from "../sdk/stream/SendStream";

export function useSendStreamState(sendStream: ISendStream | null) {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const listener = () => {
      setIsScreenSharing(sendStream?.isScreenShareEnabled() ?? false);
      setIsAudioPaused(sendStream?.isAudioPaused() ?? false);
      setIsVideoPaused(sendStream?.isVideoPaused() ?? false);
      setIsReconnecting(sendStream?.isReconnecting() ?? false);
      setIsReady(sendStream?.isReady() ?? false);
    };

    sendStream?.addEventListener("stream:pause", listener);
    sendStream?.addEventListener("stream:resume", listener);
    sendStream?.addEventListener("media:change", listener);
    sendStream?.addEventListener("start", listener);
    sendStream?.addEventListener("destroy", listener);

    listener();

    return (): void => {
      sendStream?.removeEventListener("stream:pause", listener);
      sendStream?.removeEventListener("stream:resume", listener);
      sendStream?.removeEventListener("media:change", listener);
      sendStream?.removeEventListener("start", listener);
      sendStream?.removeEventListener("destroy", listener);
    };
  }, [sendStream]);

  return {
    isScreenSharing,
    isVideoPaused,
    isAudioPaused,
    isReconnecting,
    isReady,
  };
}
