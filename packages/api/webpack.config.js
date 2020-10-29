const path = require("path");
const slsw = require("serverless-webpack");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  target: "node",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              projectReferences: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@amfa-team/types": path.resolve(__dirname, "../types/src"),
    },
  },
  plugins: [new webpack.WatchIgnorePlugin([/\.d\.ts$/])],
  externals: [
    nodeExternals({
      allowlist: ["@amfa-team/types"],
      additionalModuleDirs: [
        path.resolve(__dirname, "..", "..", "node_modules"),
      ],
    }),
  ],
  cache: false,
};
