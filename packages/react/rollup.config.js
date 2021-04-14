import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

export const extensions = [".js", ".jsx", ".ts", ".tsx"];
const extraPlugins = process.env.ROLLUP_WATCH ? [] : [terser()];

export default [
  {
    input: "lib/index.js",
    output: [
      {
        file: pkg.module,
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        extensions,
        browser: true,
        preferBuiltins: false,
        modulesOnly: true,
        resolveOnly: [/^@amfa-team\/broadcast-service.*$/],
      }),
      sourcemaps(),
      babel({
        babelHelpers: "runtime",
        extensions,
        plugins: [["@babel/plugin-transform-runtime", { useESModules: false }]],
      }),
      ...extraPlugins,
    ],
  },
  {
    input: "lib/index.js",
    output: [
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
        resolveOnly: [/^@amfa-team\/broadcast-service.*$/],
      }),
      sourcemaps(),
      babel({
        babelHelpers: "runtime",
        extensions,
        plugins: [["@babel/plugin-transform-runtime", { useESModules: false }]],
      }),
      ...extraPlugins,
    ],
  },
];
