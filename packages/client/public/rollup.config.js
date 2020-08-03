import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import serve from "rollup-plugin-serve";
import { extensions } from "../rollup.config";
import replace from "@rollup/plugin-replace";

export default [
  {
    input: "public/index.tsx",
    output: {
      file: "public/dist/index.umd.js",
      format: "umd",
      name: "picnicSDK",
      sourcemap: true,
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
        "react-router-dom": "ReactRouterDOM",
      },
    },
    external: ["react", "react-dom"],
    plugins: [
      // Allows node_modules resolution
      resolve({
        extensions,
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      replace({
        "process.env.NODE_ENV": JSON.stringify("development"),
      }),
      babel({
        babelHelpers: "bundled",
        extensions,
      }),
      serve({
        open: true,
        contentBase: ["public"],
        historyApiFallback: true,
        port: 4000,
      }),
    ],
  },
];
