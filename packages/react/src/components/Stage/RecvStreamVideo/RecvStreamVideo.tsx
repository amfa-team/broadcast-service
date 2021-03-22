import { LiveParticipant } from "@amfa-team/theme-service";
import React, { useCallback } from "react";
import { useRecvStreamState } from "../../../hooks/useRecvStreamEvents";
import type { IRecvStream } from "../../../sdk/stream/RecvStream";

export interface RecvStreamVideoProps {
  recvStream: IRecvStream;
}

export function RecvStreamVideo(props: RecvStreamVideoProps): JSX.Element {
  const { recvStream } = props;
  const {
    volume,
    isAudioEnabled,
    isReady,
    isVideoEnabled,
    isReconnecting,
  } = useRecvStreamState(recvStream);

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
    return recvStream.toggleAudio();
  }, [recvStream]);

  const onToggleFullScreen = useCallback(() => {
    console.log("full screen");
  }, []);

  return (
    <LiveParticipant
      isLocal={false}
      isFrontFacing={false}
      isVideoEnabled={isVideoEnabled}
      isFullScreen={false}
      isAudioEnabled={isAudioEnabled}
      attachAudioEffect={attachAudioEffect}
      attachVideoEffect={attachVideoEffect}
      isLoading={!isReady}
      isReconnecting={isReconnecting}
      volume={volume}
      onToggleFullScreen={onToggleFullScreen}
      onToggleVolume={onToggleVolume}
    />
  );
}
