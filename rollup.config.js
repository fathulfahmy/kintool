import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  context: "window",
  input: "src/index.js",
  output: [
    {
      file: "dist/kintool.iife.js",
      format: "iife",
      name: "kintool",
    },
    {
      file: "dist/kintool.iife.min.js",
      format: "iife",
      name: "kintool",
      plugins: [terser()],
      sourcemap: true,
    },
    {
      file: "dist/kintool.umd.js",
      format: "umd",
      name: "kintool",
    },
    {
      file: "dist/kintool.umd.min.js",
      format: "umd",
      name: "kintool",
      plugins: [terser()],
      sourcemap: true,
    },
    {
      file: "dist/kintool.esm.js",
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve({ browser: true }),
    commonjs(),
    json(),
    babel({ babelHelpers: "bundled" }),
  ],
  external: ["kintone"],
};
