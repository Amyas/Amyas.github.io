# Git提交规范化

## 一、安装 commitizen

``` bash
pnpm install commitizen --save-dev
```

## 二、安装并配置 cz-customizable

### 1、安装

``` bash
pnpm install cz-customizable --save-dev
```

### 2、在 package.json 中添加配置

``` bash
"config": {
  "commitizen": {
    "path": "node_modules/cz-customizable"
  }
}
```

### 3、创建 .cz-config.js 文件并写入配置

``` bash
touch .cz-config.js
```

``` js
// .cz-config.js
module.exports = {
  types: [
    {value:'feat', name: 'feat: 新功能'},
    {value:'fix', name: 'fix: 修复'},
    {value:'docs', name: 'docs: 文档变更'},
    {value:'style', name: 'style: 代码格式（不影响代码运行的变动）'},
    {value:'refactor', name: 'refactor: 重构（既不增加feature，也不是修复bug）'},
    {value:'perf', name: 'perf: 性能优化'},
    {value:'test', name: 'test: 增加测试'},
    {value:'chore', name: 'chore: 构建过程或辅助工具的变动'},
    {value:'revert', name: 'revert: 回退'},
    {value:'build', name: 'build: 打包'}
  ],
  messages: {
    type: '请选择提交的类型：',
    customScope: '请输入修改的范围（可选）',
    subject: '请简要描述提交（必填）',
    body: '请输入详细描述（可选）',
    footer: '请输入要关闭的issue（可选）',
    confirmCommit: '确认要使用以上信息提交？（y/n）'
  },
  subjectLimit: 72
}
```

## 三、提交测试

### 1、在 package.json 中添加脚本

``` bash
"commit": "git add . && git-cz"
```

### 2、提交

``` bash
yarn commit

# yarn run v1.22.11
# $ git add . && git-cz
# cz-cli@4.2.4, cz-customizable@6.3.0

# All lines except first will be wrapped after 100 characters.
# ? 请选择提交的类型： feat: 新功能
# ? 请输入修改的范围（可选） git
# ? 请简要描述提交（必填） 添加commitizen
# ? 请输入详细描述（可选） 
# ? 请输入要关闭的issue（可选） 

# ###--------------------------------------------------------###
# feat(git): 添加commitizen
# ###--------------------------------------------------------###

# ? 确认要使用以上信息提交？（y/n） Yes
```