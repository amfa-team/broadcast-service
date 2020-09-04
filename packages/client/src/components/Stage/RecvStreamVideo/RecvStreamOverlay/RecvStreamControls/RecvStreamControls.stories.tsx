import React from "react";
import { RecvStreamControls, UseRecvStreamControls } from ".";
import type { Story } from "@storybook/react/types-6-0";

export default {
  title: "Stage/RecvStreamVideo/RecvStreamOverlay/RecvStreamControls",
  component: RecvStreamControls,
  parameters: { actions: { argTypesRegex: "^toggle.*" } },
};

const Template: Story<UseRecvStreamControls> = (
  props: UseRecvStreamControls
): JSX.Element => <RecvStreamControls {...props} />;

export const Default = Template.bind({});

export const AudioPaused = Template.bind({});
AudioPaused.args = {
  audioPaused: true,
};

export const VideoPaused = Template.bind({});
VideoPaused.args = {
  videoPaused: true,
};
