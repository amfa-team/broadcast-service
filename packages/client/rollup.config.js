import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const production = !process.env.ROLLUP_WATCH;
const extensions = [".js", ".jsx", ".ts", ".tsx"];
export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "umd",
    name: "picnicSFU",
    sourcemap: true,
    globals: {
      react: "React",
    },
  },
  // All the used libs needs to be here
  external: ["react", "react-dom"],
  plugins: [
    // Allows node_modules resolution
    resolve({
      extensions,
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      extensions,
    }),
    production && terser(),
    !production &&
      serve({
        host: "192.168.0.18",
        open: true,
        contentBase: ["dist", "example"],
      }),
  ],
};
