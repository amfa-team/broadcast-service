import { action } from "@storybook/addon-actions";
import React from "react";
import { RecvStreamOverlay } from ".";
export default {
    title: "Stage/RecvStreamVideo/RecvStreamOverlay",
    component: RecvStreamOverlay,
};
const Template = (props) => React.createElement(RecvStreamOverlay, Object.assign({}, props));
export const Default = Template.bind({});
Default.args = {
    controls: {
        audioPaused: true,
        videoPaused: false,
        toggleAudio: action("toggleAudio"),
        toggleVideo: action("toggleVideo"),
        maximize: null,
    },
    status: {
        recvQuality: 2,
        producerAudioPaused: true,
    },
};
//# sourceMappingURL=RecvStreamOverlay.stories.js.map