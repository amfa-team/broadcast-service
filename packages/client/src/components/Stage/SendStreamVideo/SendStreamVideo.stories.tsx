import React from "react";
import { UseSendStreamVideo, SendStreamVideo } from ".";
import type { Story } from "@storybook/react/types-6-0";
import video from "../Video/test/video.mp4";

export default {
  title: "Stage/SendStreamVideo",
  component: SendStreamVideo,
};

const Template: Story<UseSendStreamVideo> = (
  props: UseSendStreamVideo
): JSX.Element => <SendStreamVideo {...props} />;

const autoPlay = (ref: HTMLVideoElement) => {
  if (ref) {
    ref.onloadedmetadata = () => ref.play();
    ref.src = video;
  }
};

export const Default = Template.bind({});
Default.args = {
  video: {
    refVideo: autoPlay,
    isLoading: false,
    isPlaying: true,
    muted: false,
    flip: false,
  },
};
