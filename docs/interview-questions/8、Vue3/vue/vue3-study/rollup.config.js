import path from "path";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import ts from "rollup-plugin-typescript2";

// 根据环境变量中的TARGET属性获取到对应模块中的package.json
const packagesDir = path.resolve(__dirname, "packages"); // 找到packages目录
const packageDir = path.resolve(packagesDir, process.env.TARGET); // 找到具体的包
const resolve = (dir) => path.resolve(packageDir, dir);

const pkg = require(resolve("package.json"));
const name = path.basename(packageDir); // 取文件名

// 对打包类型做一个映射表，根据formats进行打包
const outputConfig = {
  "esm-bundler": {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: "es",
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: "cjs",
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: "iife", // 立即执行函数
  },
};

const options = pkg.buildOptions; // 自己在package.json中定义的渲染
// rollup最终需要到处配置
export default options.formats.map((format) =>
  createConfig(format, outputConfig[format])
);

function createConfig(format, output) {
  output.name = options.name;
  output.sourcemap = true; // 生成sourcemap

  // 生成rollup配置
  return {
    input: resolve(`src/index.ts`),
    output,
    plugins: [
      json(), // 可惜json
      ts({
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
      }), // 支持ts
      nodeResolve(), // 解析第三方模块
    ],
  };
}
