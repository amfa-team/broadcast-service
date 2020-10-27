import React from "react";
import { SendStreamStatus } from ".";
export default {
    title: "Stage/SendStreamVideo/SendStreamOverlay/SendStreamStatus",
    component: SendStreamStatus,
    parameters: { actions: { argTypesRegex: "^toggle.*" } },
};
const Template = (props) => (React.createElement(SendStreamStatus, Object.assign({}, props)));
export const Initial = Template.bind({});
Initial.args = {
    state: "initial",
};
export const Creating = Template.bind({});
Creating.args = {
    state: "creating",
};
export const Connecting = Template.bind({});
Connecting.args = {
    state: "connecting",
};
export const Connected = Template.bind({});
Connected.args = {
    state: "connected",
};
export const Disconnected = Template.bind({});
Disconnected.args = {
    state: "disconnected",
};
export const WithError = Template.bind({});
WithError.args = {
    state: "error",
};
//# sourceMappingURL=SendStreamStatus.stories.js.map