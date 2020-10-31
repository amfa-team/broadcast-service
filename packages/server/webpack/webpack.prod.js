const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
      }),
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        "ecosystem.config.js",
        "package.json",
        { from: "../../yarn.lock", to: "." },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"), // Reduces 78 kb on React library
      },
    }),
  ],
});
