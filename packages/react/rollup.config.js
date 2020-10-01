import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import pkg from "./package.json";

export const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default [
  {
    input: "lib/index.js",
    output: [
      {
        file: pkg.module,
        format: "es",
        sourcemap: true,
      },
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        extensions,
        browser: true,
        preferBuiltins: false,
        modulesOnly: true,
        resolveOnly: [/^@amfa-team\/.*$/],
      }),
      babel({
        babelHelpers: "runtime",
        extensions,
        plugins: [["@babel/plugin-transform-runtime", { useESModules: true }]],
      }),
      terser(),
    ],
  },
];
