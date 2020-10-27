import { Forum, VideocamOff } from "@material-ui/icons";
import { action } from "@storybook/addon-actions";
import React from "react";
import { Controls } from "./Controls";
export default {
    title: "Stage/Controls",
    component: Controls,
};
const Template = (props) => (React.createElement(Controls, Object.assign({}, props)));
export const Default = Template.bind({});
Default.args = {
    controls: [
        { name: "chat", onClick: action("chat"), icon: React.createElement(Forum, null) },
        {
            name: "videoOff",
            onClick: () => console.log("videoOff"),
            icon: React.createElement(VideocamOff, null),
        },
    ],
};
//# sourceMappingURL=Controls.stories.js.map