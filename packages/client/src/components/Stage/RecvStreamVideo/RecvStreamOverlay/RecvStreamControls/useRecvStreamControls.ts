import { useEffect, useState, useCallback } from "react";
import RecvStream from "../../../../../sdk/stream/RecvStream";

export interface UseRecvStreamControls {
  audioPaused: boolean;
  videoPaused: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  maximize: null | (() => void);
}

export interface UseRecvStreamControlsParams {
  recvStream: RecvStream;
  setMain: (id: string) => void;
  isMain: boolean;
}

export function useRecvStreamControls(
  params: UseRecvStreamControlsParams
): UseRecvStreamControls {
  const { recvStream, setMain, isMain } = params;

  const [audioPaused, setAudioPaused] = useState<boolean>(
    recvStream.isAudioPaused()
  );
  const [videoPaused, setVideoPaused] = useState<boolean>(
    recvStream.isVideoPaused()
  );

  useEffect(() => {
    const listener = () => {
      setAudioPaused(recvStream.isAudioPaused());
      setVideoPaused(recvStream.isVideoPaused());
    };

    recvStream.addEventListener("stream:pause", listener);
    recvStream.addEventListener("stream:resume", listener);

    listener();

    return () => {
      recvStream.removeEventListener("stream:pause", listener);
      recvStream.removeEventListener("stream:resume", listener);
    };
  }, [recvStream]);

  const toggleAudio = useCallback(async () => {
    if (audioPaused) {
      await recvStream.resumeAudio();
    } else {
      await recvStream.pauseAudio();
    }
    setAudioPaused(!audioPaused);
  }, [recvStream, audioPaused]);

  const toggleVideo = useCallback(async () => {
    if (videoPaused) {
      await recvStream.resumeVideo();
    } else {
      await recvStream.pauseVideo();
    }
    setVideoPaused(!videoPaused);
  }, [recvStream, videoPaused]);

  const maximize = useCallback(() => {
    setMain(recvStream.getId());
  }, [recvStream, setMain]);

  return {
    audioPaused,
    videoPaused,
    toggleAudio,
    toggleVideo,
    maximize: isMain ? null : maximize,
  };
}
