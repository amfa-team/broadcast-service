import { action } from "@storybook/addon-actions";
import React from "react";
import { RecvStreamControls } from ".";
export default {
    title: "Stage/RecvStreamVideo/RecvStreamOverlay/RecvStreamControls",
    component: RecvStreamControls,
    parameters: { actions: { argTypesRegex: "^toggle.*" } },
};
const Template = (props) => React.createElement(RecvStreamControls, Object.assign({}, props));
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
//# sourceMappingURL=RecvStreamControls.stories.js.map