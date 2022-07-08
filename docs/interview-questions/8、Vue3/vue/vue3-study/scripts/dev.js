// 只打包指定目录
import { execa } from "execa";

build(process.env.TARGET);

async function build(target) {
  await execa(`rollup`, ["-c", "--environment", `TARGET:${target}`], {
    stdio: "inherit", // 将子进程打包的信息共享给父进程
  });
}
