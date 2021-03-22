import { captureException } from "@sentry/react";
import { useCallback } from "react";
import type { IBroadcastSdk } from "../sdk/sdk";
import type { ISendStream } from "../sdk/stream/SendStream";
import { useSendStream } from "./useSendStream";
import { useSendStreamState } from "./useSendStreamState";

export function useBroadcastControls(sdk: IBroadcastSdk) {
  const sendStream = useSendStream(sdk);
  const sendStreamState = useSendStreamState(sendStream);

  const onToggleScreenShare = useCallback(() => {
    return sendStream?.toggleScreenShare();
  }, [sendStream]);
  const onToggleBroadcast = useCallback(() => {
    const abortController = new AbortController();
    let stream: ISendStream | null = null;
    sdk
      .broadcast()
      .then((s) => {
        if (abortController.signal.aborted) {
          s.destroy().catch(captureException);
        } else {
          stream = s;
        }
      })
      .catch(captureException);

    return (): void => {
      stream?.destroy().catch(captureException);
    };
  }, [sdk]);

  const onToggleAudio = useCallback(() => {
    return sendStream?.toggleAudio();
  }, [sendStream]);
  const onToggleVideo = useCallback(() => {
    return sendStream?.toggleVideo();
  }, [sendStream]);

  return {
    isReady: sendStream !== null && sendStreamState.isReady,
    isVideoPaused: sendStreamState.isVideoPaused,
    isAudioPaused: sendStreamState.isAudioPaused,
    isScreenSharing: sendStreamState.isScreenSharing,
    onToggleVideo,
    onToggleAudio,
    onToggleScreenShare,
    onToggleBroadcast,
  };
}
