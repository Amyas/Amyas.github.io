// 把package目录下的所有包都进行打包
import fs from "fs";
import { execa } from "execa";

const targets = fs
  .readdirSync("packages")
  .filter((f) => fs.statSync(`packages/${f}`).isDirectory());

async function build(target) {
  // --c --w --environment
  await execa(`rollup`, ["-cw", "--environment", `TARGET:${target}`], {
    stdio: "inherit", // 将子进程打包的信息共享给父进程
  });
}

function runParallel(targets, iteratorFn) {
  const res = [];
  for (const item of targets) {
    const p = iteratorFn(item);
    res.push(p);
  }
  return Promise.all(res);
}

runParallel(targets, build);
