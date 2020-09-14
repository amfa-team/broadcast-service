import React from "react";
import { StageGrid, StageGridProps } from "../StageGrid";
import type { Story } from "@storybook/react/types-6-0";

export default {
  title: "Stage/StageGrid/TwoHD",
  component: StageGrid,
};

const Template: Story<StageGridProps> = (
  props: StageGridProps
): JSX.Element => <StageGrid {...props} />;

// eslint-disable-next-line react/display-name
const ImageTemplate = (width: number, height: number) => () => (
  <img
    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
    src={`https://via.placeholder.com/${width}x${height}`}
  />
);

const elements = [
  {
    size: { width: 1920, height: 1080 },
    Component: ImageTemplate(1920, 1080),
    key: "a",
  },
  {
    size: { width: 1920, height: 1080 },
    Component: ImageTemplate(1920, 1080),
    key: "b",
  },
];

export const Responsive = Template.bind({});
Responsive.args = {
  sizes: elements.map((e) => e.size),
  children: elements.map((e) => <e.Component key={e.key} />),
};

export const Tablet = Template.bind({});
Tablet.args = {
  sizes: elements.map((e) => e.size),
  children: elements.map((e) => <e.Component key={e.key} />),
};
Tablet.parameters = {
  viewport: {
    defaultViewport: "tablet",
  },
};

export const LargePhone = Template.bind({});
LargePhone.args = {
  sizes: elements.map((e) => e.size),
  children: elements.map((e) => <e.Component key={e.key} />),
};
LargePhone.parameters = {
  viewport: {
    defaultViewport: "mobile2",
  },
};

export const SmallPhone = Template.bind({});
SmallPhone.args = {
  sizes: elements.map((e) => e.size),
  children: elements.map((e) => <e.Component key={e.key} />),
};
SmallPhone.parameters = {
  viewport: {
    defaultViewport: "mobile1",
  },
};

export const TabletRotated = Template.bind({});
TabletRotated.args = {
  sizes: elements.map((e) => e.size),
  children: elements.map((e) => <e.Component key={e.key} />),
};
TabletRotated.parameters = {
  viewport: {
    defaultViewport: "tabletRotated",
  },
};

export const LargePhoneRotated = Template.bind({});
LargePhoneRotated.args = {
  sizes: elements.map((e) => e.size),
  children: elements.map((e) => <e.Component key={e.key} />),
};
LargePhoneRotated.parameters = {
  viewport: {
    defaultViewport: "mobile2Rotated",
  },
};

export const SmallPhoneRotated = Template.bind({});
SmallPhoneRotated.args = {
  sizes: elements.map((e) => e.size),
  children: elements.map((e) => <e.Component key={e.key} />),
};
SmallPhoneRotated.parameters = {
  viewport: {
    defaultViewport: "mobile1Rotated",
  },
};
