import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";
import resolve from "@rollup/plugin-node-resolve";

const production = !process.env.ROLLUP_WATCH;
const extensions = [".js", ".jsx", ".ts", ".tsx"];
export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "umd",
    name: "picnicSFU",
    sourcemap: true,
  },
  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),
    babel({
      babelHelpers: "bundled",
      extensions,
    }),
    production && terser(),
    !production &&
      serve({
        open: true,
        contentBase: ["dist", "example"],
      }),
  ],
};
