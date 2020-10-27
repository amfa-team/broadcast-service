import React from "react";
import video from "../Video/test/video.mp4";
import { SendStreamVideo } from ".";
export default {
    title: "Stage/SendStreamVideo",
    component: SendStreamVideo,
};
const Template = (props) => React.createElement(SendStreamVideo, Object.assign({}, props));
const autoPlay = (ref) => {
    if (ref) {
        // eslint-disable-next-line no-param-reassign
        ref.onloadedmetadata = () => {
            ref.play();
        };
        // eslint-disable-next-line no-param-reassign
        ref.src = video;
    }
};
export const Default = Template.bind({});
Default.args = {
    video: {
        refVideo: autoPlay,
        isLoading: false,
        isPlaying: true,
        muted: false,
        flip: false,
    },
};
//# sourceMappingURL=SendStreamVideo.stories.js.map