import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import serve from "rollup-plugin-serve";
import { extensions } from "../rollup.config";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

const replacements = {
  "process.env.NODE_ENV": JSON.stringify(
    production ? "production" : "development"
  ),
  "process.env.WS_API": JSON.stringify(process.env.WS_API || null),
  "process.env.HTTP_API": JSON.stringify(process.env.HTTP_API || null),
  "process.env.SENTRY_ENVIRONMENT": JSON.stringify(
    process.env.SENTRY_ENVIRONMENT || "local"
  ),
};

export default [
  {
    input: "public/src/index.tsx",
    cache: true,
    output: {
      file: "public/dist/index.umd.js",
      format: "umd",
      name: "picnicSDK",
      sourcemap: true, // TODO: remove sourcemap on prod
      globals: {
        react: "React",
        "react-dom": "ReactDOM",
        "react-router-dom": "ReactRouterDOM",
      },
    },
    external: ["react", "react-dom"],
    plugins: [
      resolve({
        extensions,
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      json(),
      babel({
        exclude: "node_modules/**", // only transpile our source code,
        babelHelpers: "bundled",
        extensions,
        presets: [
          "@babel/preset-typescript",
          "@babel/preset-react",
          [
            "@babel/preset-env",
            {
              modules: false,
              targets: production
                ? {
                    chrome: 55,
                    edge: 11,
                    firefox: 60,
                    safari: 11,
                    node: "12.18",
                  }
                : {
                    browsers: "last 2 chrome versions",
                  },
            },
          ],
        ],
        plugins: production ? ["@babel/plugin-proposal-class-properties"] : [],
      }),
      // Allows node_modules resolution
      replace(replacements),
      production
        ? terser()
        : serve({
            open: true,
            host: "127.0.0.1",
            contentBase: ["public"],
            historyApiFallback: true,
            port: 4000,
          }),
    ],
  },
];
