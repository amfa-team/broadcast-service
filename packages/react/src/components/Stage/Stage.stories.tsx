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

const s1 = new RecvStreamFixture({
  isVideoEnabled: true,
  isAudioEnabled: false,
  isAudioPaused: true,
  isVideoPaused: true,
  isReady: true,
  isReconnecting: false,
  audio,
  video,
});

const s2 = new RecvStreamFixture({
  isVideoEnabled: true,
  isAudioEnabled: false,
  isAudioPaused: true,
  isVideoPaused: true,
  isReady: true,
  isReconnecting: true,
  audio,
  video,
});

const s3 = new RecvStreamFixture({
  isVideoEnabled: true,
  isAudioEnabled: false,
  isAudioPaused: true,
  isVideoPaused: false,
  isReady: true,
  isReconnecting: false,
  audio,
  video,
});

const s4 = new RecvStreamFixture({
  isVideoEnabled: false,
  isAudioEnabled: false,
  isAudioPaused: true,
  isVideoPaused: false,
  isReady: false,
  isReconnecting: false,
  audio,
  video,
});

const s5 = new RecvStreamFixture({
  isVideoEnabled: false,
  isAudioEnabled: false,
  isAudioPaused: true,
  isVideoPaused: false,
  isReady: true,
  isReconnecting: false,
  audio,
  video,
});

const s6 = new RecvStreamFixture({
  isVideoEnabled: false,
  isAudioEnabled: true,
  isAudioPaused: true,
  isVideoPaused: false,
  isReady: true,
  isReconnecting: false,
  audio,
  video,
});

export const Viewer1Broadcast = (): JSX.Element => {
  const sdk = useMemo(() => {
    const s = new BroadcastSdkFixture();
    s.addRecvStream(s1);
    return s;
  }, []);
  return <Stage sdk={sdk} canBroadcast={false} />;
};

export const Viewer2Broadcast = (): JSX.Element => {
  const sdk = useMemo(() => {
    const s = new BroadcastSdkFixture();
    s.addRecvStream(s1);
    s.addRecvStream(s2);
    return s;
  }, []);
  return <Stage sdk={sdk} canBroadcast={false} />;
};

export const Viewer3Broadcast = (): JSX.Element => {
  const sdk = useMemo(() => {
    const s = new BroadcastSdkFixture();
    s.addRecvStream(s1);
    s.addRecvStream(s2);
    s.addRecvStream(s3);
    return s;
  }, []);
  return <Stage sdk={sdk} canBroadcast={false} />;
};

export const Viewer4Broadcast = (): JSX.Element => {
  const sdk = useMemo(() => {
    const s = new BroadcastSdkFixture();
    s.addRecvStream(s1);
    s.addRecvStream(s2);
    s.addRecvStream(s3);
    s.addRecvStream(s4);
    return s;
  }, []);
  return <Stage sdk={sdk} canBroadcast={false} />;
};

export const Viewer5Broadcast = (): JSX.Element => {
  const sdk = useMemo(() => {
    const s = new BroadcastSdkFixture();
    s.addRecvStream(s1);
    s.addRecvStream(s2);
    s.addRecvStream(s3);
    s.addRecvStream(s4);
    s.addRecvStream(s5);
    return s;
  }, []);
  return <Stage sdk={sdk} canBroadcast={false} />;
};

export const Viewer6Broadcast = (): JSX.Element => {
  const sdk = useMemo(() => {
    const s = new BroadcastSdkFixture();
    s.addRecvStream(s1);
    s.addRecvStream(s2);
    s.addRecvStream(s3);
    s.addRecvStream(s4);
    s.addRecvStream(s5);
    s.addRecvStream(s6);
    return s;
  }, []);
  return <Stage sdk={sdk} canBroadcast={false} />;
};
