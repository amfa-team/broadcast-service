import React from "react";
import { SendStreamControls } from "./SendStreamControls";
export default {
    title: "Stage/SendStreamControls",
    component: SendStreamControls,
    parameters: { actions: { argTypesRegex: "^toggle.*" } },
};
const Template = (props) => React.createElement(SendStreamControls, Object.assign({}, props, { extraControls: [] }));
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
//# sourceMappingURL=SendStreamControls.stories.js.map