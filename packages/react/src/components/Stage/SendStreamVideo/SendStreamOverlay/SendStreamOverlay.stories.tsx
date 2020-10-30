import type { Story } from "@storybook/react";
import React from "react";
import type { UseSendStreamStatus } from ".";
import { SendStreamOverlay } from ".";

export default {
  title: "Stage/SendStreamOverlay/SendStreamOverlay",
  component: SendStreamOverlay,
};

const Template: Story<UseSendStreamStatus> = (
  props: UseSendStreamStatus,
): JSX.Element => <SendStreamOverlay {...props} />;

export const Default = Template.bind({});
Default.args = {
  state: "creating",
};
