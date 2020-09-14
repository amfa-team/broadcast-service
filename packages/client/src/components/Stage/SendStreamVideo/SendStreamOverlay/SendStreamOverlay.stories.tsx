import React from "react";
import { SendStreamOverlay, UseSendStreamStatus } from ".";
import type { Story } from "@storybook/react/types-6-0";

export default {
  title: "Stage/SendStreamOverlay/SendStreamOverlay",
  component: SendStreamOverlay,
};

const Template: Story<UseSendStreamStatus> = (
  props: UseSendStreamStatus
): JSX.Element => <SendStreamOverlay {...props} />;

export const Default = Template.bind({});
Default.args = {
  state: "creating",
};
