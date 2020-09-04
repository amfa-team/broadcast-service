import React from "react";
import { SendStreamControls } from "./SendStreamControls";
import type { UseSendStreamControls } from "./useSendStreamControls";
import type { Story } from "@storybook/react/types-6-0";

export default {
  title: "Stage/SendStreamControls",
  component: SendStreamControls,
  parameters: { actions: { argTypesRegex: "^toggle.*" } },
};

const Template: Story<UseSendStreamControls> = (
  props: UseSendStreamControls
): JSX.Element => <SendStreamControls {...props} />;

export const Default = Template.bind({});
Default.args = {
  active: true,
};

export const AudioPaused = Template.bind({});
AudioPaused.args = {
  active: true,
  audioPaused: true,
};

export const VideoPaused = Template.bind({});
VideoPaused.args = {
  active: true,
  videoPaused: true,
};

export const ScreenShareEnabled = Template.bind({});
ScreenShareEnabled.args = {
  active: true,
  isScreenShareEnabled: true,
};

export const NotActive = Template.bind({});
NotActive.args = {
  active: false,
};
