// minimist可以解析命令行参数
const args = require("minimist")(process.argv.slice(2));
const path = require("path");

const target = args._[0];
const format = args.f;
const entry = path.resolve(__dirname, `../packages/${target}/src/index.ts`);
const packageName = require(path.resolve(
  __dirname,
  `../packages/${target}/package.json`
)).buildOptions?.name;

// iife 自执行函数 global
// cjs  commonjs规范
// esm  es6Module
const outputFormat = format.startsWith("global")
  ? "iife"
  : format === "cjs"
  ? "cjs"
  : "esm";
const outfile = path.resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${format}.js`
);

const { build } = require("esbuild");

build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  sourcemap: true,
  format: outputFormat,
  globalName: packageName,
  platform: format === "cjs" ? "node" : "browser",
  watch: {
    onRebuild(error) {
      if (!error) console.log("rebuild~~~");
    },
  },
}).then(() => {
  console.log("watching~~~");
});
