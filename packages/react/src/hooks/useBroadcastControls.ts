import { captureException } from "@sentry/react";
import { useCallback, useEffect, useState } from "react";
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
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isTogglingBroadcast, setIsTogglingBroadcast] = useState(false);

  useEffect(() => {
    setIsBroadcasting(false);
    setIsTogglingBroadcast(false);
  }, [sdk]);

  useEffect(() => {
    const abortController = new AbortController();
    let stream: ISendStream | null = null;

    if (isBroadcasting) {
      sdk
        .broadcast()
        .then((s) => {
          if (abortController.signal.aborted) {
            s.destroy().catch(captureException);
          } else {
            stream = s;
          }
        })
        .catch(captureException)
        .then(() => {
          setIsTogglingBroadcast(false);
        })
        .catch(captureException);
    } else {
      setIsTogglingBroadcast(false);
    }

    return (): void => {
      stream?.destroy().catch(captureException);
    };
  }, [isBroadcasting, sdk]);

  const onToggleBroadcast = useCallback(() => {
    setIsTogglingBroadcast(true);
    setIsBroadcasting((prev) => !prev);
  }, []);

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
    isTogglingBroadcast,
    isBroadcasting: sendStream !== null && sendStreamState.isReady,
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
