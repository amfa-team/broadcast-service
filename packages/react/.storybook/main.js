const { existsSync } = require("fs");
const path = require("path");

const toPath = (_path) => {
  const p = path.join(__dirname, "..", "node_modules", _path);

  if (existsSync(p)) {
    return p;
  }

  return path.join(__dirname, "..", "..", "..", "node_modules", _path);
};

module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    { name: "@storybook/addon-essentials", options: { docs: false } },
  ],
  webpackFinal: async (config) => {
    // https://github.com/storybookjs/storybook/issues/10231#issuecomment-728038867
    config.resolve.alias["recoil"] = toPath("recoil");
    config.resolve.alias["@emotion/core"] = toPath("@emotion/react");
    config.resolve.alias["@emotion/react"] = toPath("@emotion/react");

    // Return the altered config
    return config;
  },
};
