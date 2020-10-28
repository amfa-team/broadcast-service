import type { Story } from "@storybook/react";
import React from "react";
import type { UseRecvStreamStatus } from ".";
import { RecvStreamStatus } from ".";

export default {
  title: "Stage/RecvStreamVideo/RecvStreamOverlay/RecvStreamStatus",
  component: RecvStreamStatus,
  parameters: { actions: { argTypesRegex: "^toggle.*" } },
};

const Template: Story<UseRecvStreamStatus> = (
  props: UseRecvStreamStatus,
): JSX.Element => <RecvStreamStatus {...props} />;

export const None = Template.bind({});
None.args = {
  recvQuality: null,
};

export const Zero = Template.bind({});
Zero.args = {
  recvQuality: 0,
};

export const One = Template.bind({});
One.args = {
  recvQuality: 1,
};

export const Two = Template.bind({});
Two.args = {
  recvQuality: 2,
};

export const Three = Template.bind({});
Three.args = {
  recvQuality: 3,
};

export const Four = Template.bind({});
Four.args = {
  recvQuality: 4,
};

export const AudioPaused = Template.bind({});
AudioPaused.args = {
  recvQuality: 4,
  producerAudioPaused: true,
};