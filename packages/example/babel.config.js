module.exports = {
  presets: [
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: 70,
          edge: 18,
          firefox: 64,
          safari: 12,
        },
        loose: false,
        useBuiltIns: "usage",
        corejs: 3,
      },
    ],
  ],
  plugins: [
    [
      "babel-plugin-transform-imports",
      {
        "@material-ui/core": {
          // eslint-disable-next-line no-template-curly-in-string
          transform: "@material-ui/core/esm/${member}",
          preventFullImport: true,
        },
        "@material-ui/icons": {
          // eslint-disable-next-line no-template-curly-in-string
          transform: "@material-ui/icons/esm/${member}",
          preventFullImport: true,
        },
        "@material-ui/lab": {
          // eslint-disable-next-line no-template-curly-in-string
          transform: "@material-ui/lab/esm/${member}",
          preventFullImport: true,
        },
      },
    ],
  ],
};
