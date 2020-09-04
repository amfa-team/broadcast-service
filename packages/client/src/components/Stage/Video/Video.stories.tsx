import React, { createRef } from "react";
import { Video, VideoComponentProps } from ".";
import type { Story } from "@storybook/react/types-6-0";
import video from "./test/video.mp4";

export default {
  title: "Stage/Video",
  component: Video,
};

const Template: Story<VideoComponentProps> = (
  props: VideoComponentProps
): JSX.Element => <Video {...props} />;

export const Loading = Template.bind({});
Loading.args = {
  refVideo: createRef(),
  isLoading: true,
  isPlaying: false,
  muted: false,
  flip: false,
};

const autoPlay = (ref: HTMLVideoElement) => {
  if (ref) {
    ref.onloadedmetadata = () => ref.play();
    ref.src = video;
  }
};

export const Default = Template.bind({});
Default.args = {
  refVideo: autoPlay,
  isLoading: false,
  isPlaying: true,
  muted: false,
  flip: false,
};

export const Muted = Template.bind({});
Muted.args = {
  refVideo: autoPlay,
  isLoading: false,
  isPlaying: true,
  muted: true,
  flip: false,
};

export const Flipped = Template.bind({});
Flipped.args = {
  refVideo: autoPlay,
  isLoading: false,
  isPlaying: true,
  muted: false,
  flip: true,
};

export const ManualPlay = Template.bind({});
ManualPlay.args = {
  refVideo: (ref: HTMLVideoElement) => {
    if (ref) {
      ref.src = video;
    }
  },
  isLoading: false,
  isPlaying: false,
  muted: false,
  flip: true,
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  refVideo: autoPlay,
  isLoading: false,
  isPlaying: true,
  muted: true,
  flip: false,
  children: (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255,255,255,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Overlay
    </div>
  ),
};
