import type { Story } from "@storybook/react";
import React from "react";
import video from "../Video/test/video.mp4";
import type { UseSendStreamVideo } from ".";
import { SendStreamVideo } from ".";

export default {
  title: "Stage/SendStreamVideo",
  component: SendStreamVideo,
};

const Template: Story<UseSendStreamVideo> = (
  props: UseSendStreamVideo,
): JSX.Element => <SendStreamVideo {...props} />;

const autoPlay = (ref: HTMLVideoElement | null) => {
  if (ref) {
    // eslint-disable-next-line no-param-reassign
    ref.onloadedmetadata = () => {
      ref.play();
    };
    // eslint-disable-next-line no-param-reassign
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
