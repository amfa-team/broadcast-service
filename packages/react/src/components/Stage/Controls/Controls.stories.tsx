import { Forum, VideocamOff } from "@material-ui/icons";
import { action } from "@storybook/addon-actions";
import type { Story } from "@storybook/react";
import React from "react";
import type { ControlsProps } from "./Controls";
import { Controls } from "./Controls";

export default {
  title: "Stage/Controls",
  component: Controls,
};

const Template: Story<ControlsProps> = (props: ControlsProps): JSX.Element => (
  <Controls {...props} />
);

export const Default = Template.bind({});
Default.args = {
  controls: [
    { name: "chat", onClick: action("chat"), icon: <Forum /> },
    {
      name: "videoOff",
      onClick: () => console.log("videoOff"),
      icon: <VideocamOff />,
    },
  ],
};
