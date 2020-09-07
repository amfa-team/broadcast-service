import { useEffect, useState, useCallback } from "react";
import SendStream from "../../../sdk/stream/SendStream";
import { ControlElement } from "../Controls";

export interface UseSendStreamControls {
  active: boolean;
  audioPaused: boolean;
  videoPaused: boolean;
  toggleActive: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  isScreenShareEnabled: boolean;
  extraControls: ControlElement[];
}

export interface UseSendStreamControlsParams {
  stream: SendStream | null;
  toggleActive: () => void;
  extraControls?: ControlElement[] | null;
}

export default function useSendStreamControls({
  stream,
  toggleActive,
  extraControls,
}: UseSendStreamControlsParams): UseSendStreamControls {
  const [audioPaused, setAudioPaused] = useState<boolean>(
    stream?.isAudioPaused() ?? false
  );
  const [videoPaused, setVideoPaused] = useState<boolean>(
    stream?.isVideoPaused() ?? false
  );
  const [isScreenShareEnabled, setIsScreenShareEnabled] = useState<boolean>(
    stream?.isScreenShareEnabled() ?? false
  );
  const [active, setActive] = useState<boolean>(stream !== null);

  useEffect(() => {
    const listener = () => {
      setAudioPaused(stream?.isAudioPaused() ?? false);
      setVideoPaused(stream?.isVideoPaused() ?? false);
      setIsScreenShareEnabled(stream?.isScreenShareEnabled() ?? false);
    };

    setActive(stream !== null);
    stream?.addEventListener("stream:pause", listener);
    stream?.addEventListener("stream:resume", listener);
    stream?.addEventListener("media:change", listener);

    return () => {
      stream?.removeEventListener("stream:pause", listener);
      stream?.removeEventListener("stream:resume", listener);
      stream?.addEventListener("media:change", listener);
    };
  }, [stream]);

  const toggleAudio = useCallback(async () => {
    setAudioPaused(!audioPaused);
    if (audioPaused) {
      await stream?.resumeAudio();
    } else {
      await stream?.pauseAudio();
    }
  }, [stream, audioPaused]);
  const toggleVideo = useCallback(async () => {
    setVideoPaused(!videoPaused);
    if (videoPaused) {
      await stream?.resumeVideo();
    } else {
      await stream?.pauseVideo();
    }
  }, [stream, videoPaused]);
  const toggleScreenShare = useCallback(async () => {
    setIsScreenShareEnabled(!isScreenShareEnabled);
    if (isScreenShareEnabled) {
      await stream?.disableShare();
    } else {
      await stream?.screenShare();
    }
  }, [stream, isScreenShareEnabled]);

  return {
    active,
    audioPaused,
    videoPaused,
    isScreenShareEnabled,
    toggleAudio,
    toggleActive,
    toggleVideo,
    toggleScreenShare,
    extraControls: extraControls ?? [],
  };
}
