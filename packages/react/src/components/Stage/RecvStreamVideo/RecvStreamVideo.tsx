import { LiveParticipant } from "@amfa-team/theme-service";
import { captureException } from "@sentry/react";
import React, { useCallback, useEffect, useState } from "react";
import { useRecvStreamState } from "../../../hooks/useRecvStreamEvents";
import type { IRecvStream } from "../../../sdk/stream/RecvStream";

export interface RecvStreamVideoProps {
  recvStream: IRecvStream;
  isFullScreen: boolean;
  liveDictionary?: any; // Flemme
  setFullScreen: (recvStream: IRecvStream) => Promise<void>;
}

export function RecvStreamVideo(props: RecvStreamVideoProps): JSX.Element {
  const { recvStream, isFullScreen, setFullScreen, liveDictionary } = props;
  const {
    volume,
    isAudioEnabled,
    isReady,
    isVideoEnabled,
    isReconnecting,
  } = useRecvStreamState(recvStream);
  const [isTogglingVolume, setIsTogglingVolume] = useState(false);
  const [isTogglingFullScreen, setIsTogglingFullScreen] = useState(false);

  const onToggleFullScreen = useCallback(async () => {
    try {
      setIsTogglingFullScreen(true);
      await setFullScreen(recvStream);
    } catch (e) {
      captureException(e);
    } finally {
      setIsTogglingFullScreen(false);
    }
  }, [recvStream, setFullScreen]);

  useEffect(() => {
    setIsTogglingVolume(false);
    setIsTogglingFullScreen(false);
  }, [recvStream]);

  const attachAudioEffect = useCallback(
    (el: HTMLAudioElement | null) => {
      return recvStream.attachAudioEffect(el);
    },
    [recvStream],
  );

  const attachVideoEffect = useCallback(
    (el: HTMLVideoElement | null) => {
      return recvStream.attachVideoEffect(el);
    },
    [recvStream],
  );

  const onToggleVolume = useCallback(async () => {
    try {
      setIsTogglingVolume(true);
      await recvStream.toggleAudio();
    } catch (e) {
      captureException(e);
    } finally {
      setIsTogglingVolume(false);
    }
  }, [recvStream]);

  return (
    <LiveParticipant
      isLoading={!isReady}
      isReconnecting={isReconnecting}
      isLiveLabel={
        liveDictionary
          ? `${liveDictionary?.live[0].toUpperCase()}${liveDictionary.live?.substr(
              1,
            )}`
          : "En direct"
      }
      isReconnectingLabel={
        liveDictionary ? liveDictionary?.isReconnectingLabel : "Reconnexion"
      }
      isLocal={false}
      isFrontFacing={false}
      isVideoEnabled={isVideoEnabled}
      isAudioEnabled={isAudioEnabled}
      attachAudioEffect={attachAudioEffect}
      attachVideoEffect={attachVideoEffect}
      volume={volume}
      isFullScreen={isFullScreen}
      isTogglingVolume={isTogglingVolume}
      isTogglingFullScreen={isTogglingFullScreen}
      onToggleFullScreen={onToggleFullScreen}
      onToggleVolume={onToggleVolume}
    />
  );
}
