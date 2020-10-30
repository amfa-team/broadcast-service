import { action } from "@storybook/addon-actions";
import type { Story } from "@storybook/react";
import React from "react";
import type { UseRecvStreamOverlay } from ".";
import { RecvStreamOverlay } from ".";

export default {
  title: "Stage/RecvStreamVideo/RecvStreamOverlay",
  component: RecvStreamOverlay,
};

const Template: Story<UseRecvStreamOverlay> = (
  props: UseRecvStreamOverlay,
): JSX.Element => <RecvStreamOverlay {...props} />;

export const Default = Template.bind({});
Default.args = {
  controls: {
    audioPaused: true,
    videoPaused: false,
    toggleAudio: action("toggleAudio"),
    toggleVideo: action("toggleVideo"),
    maximize: null,
  },
  status: {
    recvQuality: 2,
    producerAudioPaused: true,
  },
};
