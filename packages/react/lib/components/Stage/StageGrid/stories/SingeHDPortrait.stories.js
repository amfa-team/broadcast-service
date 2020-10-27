import React from "react";
import { StageGrid } from "../StageGrid";
export default {
    title: "Stage/StageGrid/SingeHDPortrait",
    component: StageGrid,
};
const Template = (props) => React.createElement(StageGrid, Object.assign({}, props));
function ImageTemplate(width, height) {
    return function Image() {
        return (React.createElement("img", { alt: "", style: { maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }, src: `https://via.placeholder.com/${width}x${height}` }));
    };
}
const elements = [
    {
        size: { width: 1080, height: 1920 },
        Component: ImageTemplate(1080, 1920),
        key: "a",
    },
];
export const Responsive = Template.bind({});
Responsive.args = {
    sizes: elements.map((e) => e.size),
    children: elements.map((e) => React.createElement(e.Component, { key: e.key })),
};
export const Tablet = Template.bind({});
Tablet.args = {
    sizes: elements.map((e) => e.size),
    children: elements.map((e) => React.createElement(e.Component, { key: e.key })),
};
Tablet.parameters = {
    viewport: {
        defaultViewport: "tablet",
    },
};
export const LargePhone = Template.bind({});
LargePhone.args = {
    sizes: elements.map((e) => e.size),
    children: elements.map((e) => React.createElement(e.Component, { key: e.key })),
};
LargePhone.parameters = {
    viewport: {
        defaultViewport: "mobile2",
    },
};
export const SmallPhone = Template.bind({});
SmallPhone.args = {
    sizes: elements.map((e) => e.size),
    children: elements.map((e) => React.createElement(e.Component, { key: e.key })),
};
SmallPhone.parameters = {
    viewport: {
        defaultViewport: "mobile1",
    },
};
export const TabletRotated = Template.bind({});
TabletRotated.args = {
    sizes: elements.map((e) => e.size),
    children: elements.map((e) => React.createElement(e.Component, { key: e.key })),
};
TabletRotated.parameters = {
    viewport: {
        defaultViewport: "tabletRotated",
    },
};
export const LargePhoneRotated = Template.bind({});
LargePhoneRotated.args = {
    sizes: elements.map((e) => e.size),
    children: elements.map((e) => React.createElement(e.Component, { key: e.key })),
};
LargePhoneRotated.parameters = {
    viewport: {
        defaultViewport: "mobile2Rotated",
    },
};
export const SmallPhoneRotated = Template.bind({});
SmallPhoneRotated.args = {
    sizes: elements.map((e) => e.size),
    children: elements.map((e) => React.createElement(e.Component, { key: e.key })),
};
SmallPhoneRotated.parameters = {
    viewport: {
        defaultViewport: "mobile1Rotated",
    },
};
//# sourceMappingURL=SingeHDPortrait.stories.js.map