import { captureException } from "@sentry/react";
import { useCallback, useState } from "react";
import type { IBroadcastSdk } from "../sdk/sdk";
import type { ISendStream } from "../sdk/stream/SendStream";
import { useSendStream } from "./useSendStream";
import { useSendStreamState } from "./useSendStreamState";

export function useBroadcastControls(sdk: IBroadcastSdk) {
  const sendStream = useSendStream(sdk);
  const sendStreamState = useSendStreamState(sendStream);
  const [isTogglingVideo, setIsTogglingVideo] = useState(false);
  const [isTogglingAudio, setIsTogglingAudio] = useState(false);
  const [isTogglingScreenShare, setIsTogglingScreenShare] = useState(false);

  const onToggleBroadcast = useCallback(async () => {
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

  const onToggleAudio = useCallback(async () => {
    try {
      setIsTogglingAudio(true);
      await sendStream?.toggleAudio();
    } catch (e) {
      captureException(e);
    } finally {
      setIsTogglingAudio(false);
    }
  }, [sendStream]);

  const onToggleVideo = useCallback(async () => {
    try {
      setIsTogglingVideo(true);
      await sendStream?.toggleVideo();
    } catch (e) {
      captureException(e);
    } finally {
      setIsTogglingVideo(false);
    }
  }, [sendStream]);

  const onToggleScreenShare = useCallback(async () => {
    try {
      setIsTogglingScreenShare(true);
      await sendStream?.toggleScreenShare();
    } catch (e) {
      captureException(e);
    } finally {
      setIsTogglingScreenShare(false);
    }
  }, [sendStream]);

  return {
    isReady: sendStream !== null && sendStreamState.isReady,
    isVideoPaused: sendStreamState.isVideoPaused,
    isAudioPaused: sendStreamState.isAudioPaused,
    isScreenSharing: sendStreamState.isScreenSharing,
    isTogglingVideo,
    isTogglingAudio,
    isTogglingScreenShare,
    onToggleVideo,
    onToggleAudio,
    onToggleScreenShare,
    onToggleBroadcast,
  };
}
