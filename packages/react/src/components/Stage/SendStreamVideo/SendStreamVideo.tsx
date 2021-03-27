import { LiveParticipant } from "@amfa-team/theme-service";
import React, { useCallback } from "react";
import { useSendStreamState } from "../../../hooks/useSendStreamState";
import type { ISendStream } from "../../../sdk/stream/SendStream";

export interface SendStreamVideoProps {
  sendStream: ISendStream;
}

export function SendStreamVideo(props: SendStreamVideoProps): JSX.Element {
  const { sendStream } = props;
  const {
    isScreenSharing,
    isVideoPaused,
    isAudioPaused,
    isReconnecting,
    isReady,
  } = useSendStreamState(sendStream);

  const attachVideoEffect = useCallback(
    (el: HTMLVideoElement | null) => {
      return sendStream.attachVideoEffect(el);
    },
    [sendStream],
  );

  const attachAudioEffect = useCallback(() => {
    return () => {
      // no-op
    };
  }, []);

  return (
    <LiveParticipant
      isLoading={!isReady}
      isReconnecting={isReconnecting}
      isLiveLabel="Live (TODO)"
      isReconnectingLabel="Reconnecting (TODO)"
      isLocal
      isFrontFacing={!isScreenSharing}
      isVideoEnabled={!isVideoPaused}
      isAudioEnabled={!isAudioPaused}
      attachAudioEffect={attachAudioEffect}
      attachVideoEffect={attachVideoEffect}
      volume={100}
      isFullScreen={false}
      isTogglingVolume={false}
      isTogglingFullScreen={false}
      onToggleFullScreen={() => {
        // no-op
      }}
      onToggleVolume={() => {
        // no-op
      }}
    />
  );
}
