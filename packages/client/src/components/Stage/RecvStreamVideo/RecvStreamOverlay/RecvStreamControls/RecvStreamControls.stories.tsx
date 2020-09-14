import React from "react";
import { RecvStreamControls, UseRecvStreamControls } from ".";
import type { Story } from "@storybook/react/types-6-0";
import { action } from "@storybook/addon-actions";

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

export const WithMaximize = Template.bind({});
WithMaximize.args = {
  maximize: action("maximize"),
};
