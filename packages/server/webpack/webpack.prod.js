const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({})],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        "ecosystem.config.js",
        "package.json",
        { from: "../../yarn.lock", to: "." },
      ],
    }),
  ],
});
