import React, { createRef } from "react";
import { UseRecvStreamVideo, RecvStreamVideo } from ".";
import type { Story } from "@storybook/react/types-6-0";
import video from "../Video/test/video.mp4";
import { action } from "@storybook/addon-actions";

export default {
  title: "Stage/RecvStreamVideo",
  component: RecvStreamVideo,
};

const Template: Story<UseRecvStreamVideo> = (
  props: UseRecvStreamVideo
): JSX.Element => <RecvStreamVideo {...props} />;

export const Loading = Template.bind({});
Loading.args = {
  video: {
    refVideo: createRef(),
    isLoading: true,
    isPlaying: false,
    muted: false,
    flip: false,
  },
  overlay: {
    controls: {
      audioPaused: false,
      videoPaused: false,
      toggleAudio: action("toggleAudio"),
      toggleVideo: action("toggleVideo"),
      maximize: action("maximize"),
    },
    status: {
      recvQuality: null,
      producerAudioPaused: true,
    },
  },
};

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
  overlay: {
    controls: {
      audioPaused: false,
      videoPaused: false,
      toggleAudio: action("toggleAudio"),
      toggleVideo: action("toggleVideo"),
      maximize: action("maximize"),
    },
    status: {
      recvQuality: 3,
      producerAudioPaused: true,
    },
  },
};

export const ManualPlay = Template.bind({});
ManualPlay.args = {
  video: {
    refVideo: (ref: HTMLVideoElement) => {
      if (ref) {
        ref.src = video;
      }
    },
    isLoading: false,
    isPlaying: false,
    muted: false,
    flip: true,
  },
  overlay: {
    controls: {
      audioPaused: true,
      videoPaused: false,
      toggleAudio: action("toggleAudio"),
      toggleVideo: action("toggleVideo"),
      maximize: null,
    },
    status: {
      recvQuality: 1,
      producerAudioPaused: true,
    },
  },
};
