import { LiveHost } from "@amfa-team/theme-service";
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
    <LiveHost
      isLoading={!isReady}
      isReconnecting={isReconnecting}
      isLiveLabel="En Direct"
      isReconnectingLabel="Reconnexion"
      isFrontFacing={!isScreenSharing}
      isVideoEnabled={!isVideoPaused}
      attachAudioEffect={attachAudioEffect}
      attachVideoEffect={attachVideoEffect}
    />
  );
}
