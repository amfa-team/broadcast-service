import React from "react";
import { RecvStreamOverlay, UseRecvStreamOverlay } from ".";
import type { Story } from "@storybook/react/types-6-0";
import { action } from "@storybook/addon-actions";

export default {
  title: "Stage/RecvStreamVideo/RecvStreamOverlay",
  component: RecvStreamOverlay,
};

const Template: Story<UseRecvStreamOverlay> = (
  props: UseRecvStreamOverlay
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
