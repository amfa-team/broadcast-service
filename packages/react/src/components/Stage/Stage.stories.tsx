import React, { useMemo } from "react";
import audio from "../../fixtures/assets/outfoxing.mp3";
import video from "../../fixtures/assets/video.mp4";
import { BroadcastSdkFixture } from "../../fixtures/BroadcastSdkFixture";
import { RecvStreamFixture } from "../../fixtures/RecvStreamFixture";
import { Stage } from ".";

export default {
  title: "Stage/Stage",
  component: Stage,
};

export const Viewer1Broadcast = (): JSX.Element => {
  const sdk = useMemo(() => {
    const s = new BroadcastSdkFixture();
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    return s;
  }, []);
  return <Stage sdk={sdk} canBroadcast={false} />;
};

export const Viewer2Broadcast = (): JSX.Element => {
  const sdk = useMemo(() => {
    const s = new BroadcastSdkFixture();
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    return s;
  }, []);
  return <Stage sdk={sdk} canBroadcast={false} />;
};

export const Viewer3Broadcast = (): JSX.Element => {
  const sdk = useMemo(() => {
    const s = new BroadcastSdkFixture();
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    return s;
  }, []);
  return <Stage sdk={sdk} canBroadcast={false} />;
};

export const Viewer4Broadcast = (): JSX.Element => {
  const sdk = useMemo(() => {
    const s = new BroadcastSdkFixture();
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    return s;
  }, []);
  return <Stage sdk={sdk} canBroadcast={false} />;
};

export const Viewer5Broadcast = (): JSX.Element => {
  const sdk = useMemo(() => {
    const s = new BroadcastSdkFixture();
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    return s;
  }, []);
  return <Stage sdk={sdk} canBroadcast={false} />;
};

export const Viewer6Broadcast = (): JSX.Element => {
  const sdk = useMemo(() => {
    const s = new BroadcastSdkFixture();
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    s.addRecvStream(
      new RecvStreamFixture({
        isVideoEnabled: true,
        isAudioEnabled: false,
        isAudioPaused: true,
        isVideoPaused: true,
        isReady: true,
        isReconnecting: false,
        audio,
        video,
      }),
    );
    return s;
  }, []);
  return <Stage sdk={sdk} canBroadcast={false} />;
};
