import React from "react";
import { Controls, ControlsProps } from "./Controls";
import type { Story } from "@storybook/react/types-6-0";
import { Forum, VideocamOff } from "@material-ui/icons";
import { action } from "@storybook/addon-actions";

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
