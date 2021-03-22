import type { Story } from "@storybook/react";
import React from "react";
import audio from "../../../fixtures/assets/outfoxing.mp3";
import video from "../../../fixtures/assets/video.mp4";
import type { RecvStreamState } from "../../../fixtures/RecvStreamFixture";
import { RecvStreamFixture } from "../../../fixtures/RecvStreamFixture";
import { RecvStreamVideo } from ".";

export default {
  title: "Stage/RecvStreamVideo",
  component: RecvStreamVideo,
};

const Template: Story<RecvStreamState> = (
  state: RecvStreamState,
): JSX.Element => {
  const recvStream = new RecvStreamFixture({ ...state });
  return <RecvStreamVideo recvStream={recvStream} />;
};

export const Loading = Template.bind({});
Loading.args = {
  isVideoEnabled: false,
  isAudioEnabled: false,
  isAudioPaused: true,
  isVideoPaused: true,
  isReady: false,
  isReconnecting: false,
  audio,
  video,
};

export const Default = Template.bind({});
Default.args = {
  isVideoEnabled: true,
  isAudioEnabled: true,
  isAudioPaused: false,
  isVideoPaused: false,
  isReady: true,
  isReconnecting: false,
  audio,
  video,
};
