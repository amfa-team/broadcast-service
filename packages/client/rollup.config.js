import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import autoExternal from "rollup-plugin-auto-external";
import typescript from "@rollup/plugin-typescript";

export const extensions = [".js", ".jsx", ".ts", ".tsx"];
export default [
  {
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
      typescript(),
      babel({
        babelHelpers: "bundled",
        extensions,
      }),
      terser(),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.module.js",
      name: "nugit-core-service",
      format: "es",
      sourcemap: true,
    },
    // All the used libs needs to be here
    plugins: [
      autoExternal(),
      // Allows node_modules resolution
      resolve({
        extensions,
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      babel({
        babelHelpers: "runtime",
        extensions,
        plugins: [["@babel/plugin-transform-runtime", { useESModules: true }]],
      }),
      // terser does not support optional chaining https://github.com/terser/terser/issues/567
      terser(),
    ],
  },
];
