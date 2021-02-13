const { resolve } = require("path");
module.exports = {
  dist: resolve(__dirname, "..", "dist"),
  src: resolve(__dirname, "..", "src"),
  entry: resolve(__dirname, "..", "src", "index.ts"),
};
