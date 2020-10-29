const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  optimization: {
    minimize: false,
  },
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      // Once TypeScript is configured to output source maps we need to tell webpack
      // to extract these source maps and pass them to the browser,
      // this way we will get the source file exactly as we see it in our code editor.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: "/node_modules/",
      },
      {
        enforce: "pre",
        test: /\.tsx?$/,
        use: "source-map-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.tsx?$/,
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              projectReferences: true,
              happyPackMode: true, // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
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
  plugins: [
    new CopyPlugin({
      patterns: [".env", "package.json", { from: "../../yarn.lock", to: "." }],
    }),
  ],
  externals: [
    nodeExternals({
      allowlist: ["@amfa-team/types"],
      additionalModuleDirs: [
        path.resolve(__dirname, "..", "..", "node_modules"),
      ],
    }),
  ],
  stats: {
    warningsFilter: [/Failed to parse source map/],
  },
};
