module.exports = {
  presets: [
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: 55,
          edge: 11,
          firefox: 60,
          safari: 11,
        },
        loose: false,
        useBuiltIns: "usage",
        corejs: 3,
      },
    ],
  ],
  plugins: [],
};
