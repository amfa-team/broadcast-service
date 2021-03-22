import React from "react";
import { SbsThemeProvider } from "@amfa-team/theme-service";
// import { RecoilRoot } from "recoil";
import { MINIMAL_VIEWPORTS } from "@storybook/addon-viewport";
import "normalize.css/normalize.css";
import "react-datepicker/dist/react-datepicker.css";
import "@amfa-team/theme-service/dist/index.css";
import "@amfa-team/user-service/dist/index.css";

const customViewports = Object.keys(MINIMAL_VIEWPORTS).reduce((acc, key) => {
  acc[`${key}Rotated`] = {
    name: `${MINIMAL_VIEWPORTS[key].name} Rotated`,
    styles: {
      width: MINIMAL_VIEWPORTS[key].styles.height,
      height: MINIMAL_VIEWPORTS[key].styles.width,
    },
    type: MINIMAL_VIEWPORTS[key].type,
  };
  return acc;
}, {});

const viewports = {
  ...MINIMAL_VIEWPORTS,
  ...customViewports,
};

export const parameters = {
  layout: "fullscreen",
  viewport: { viewports },
};

export const decorators = [
  (Story) => (
    // <RecoilRoot>
    <SbsThemeProvider>
      <Story />
    </SbsThemeProvider>
    // </RecoilRoot>
  ),
];
