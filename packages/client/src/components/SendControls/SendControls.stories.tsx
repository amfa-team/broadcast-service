import React from "react";
import { SendStreamControls } from "./SendStreamControls";
import type { UseSendStreamControls } from "./useSendStreamControls";
import type { Story } from "@storybook/react/types-6-0";

export default {
  title: "SendStreamControls",
  component: SendStreamControls,
  parameters: { actions: { argTypesRegex: "^toggle.*" } },
};

const Template: Story<UseSendStreamControls> = (
  props: UseSendStreamControls
): JSX.Element => <SendStreamControls {...props} />;

export const Default = Template.bind({});

export const AudioPaused = Template.bind({});
AudioPaused.args = {
  audioPaused: true,
};

export const VideoPaused = Template.bind({});
VideoPaused.args = {
  videoPaused: true,
};

export const ScreenShareEnabled = Template.bind({});
ScreenShareEnabled.args = {
  isScreenShareEnabled: true,
};
