---
title: Git提交规范自动化
---

## 一、规范 Git 提交规范

### 1、安装依赖

``` bash
pnpm install commitizen cz-customizable --save-dev
```

### 2、创建 Git 提交规范文件

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

### 3、在 package.json 添加相关配置

``` json
"scripts": {
  // ...
  "commit": "git add . && git-cz",
},
"config": {
  "commitizen": {
    "path": "node_modules/cz-customizable"
  }
}
```

### 4、 验证测试结果

``` bash
npm run commit

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

## 二、校验 Git 提交规范

### 1、安装依赖

``` bash
pnpm install husky @commitlint/cli @commitlint/config-conventional --save-dev
```

### 2、创建 Git 提交校验文件

``` bash
touch commitlint.config.js
```

``` js
// commitlint.config.js

module.exports = {
  extends: ['@commitlint/config-conventional']
}
```

``` bash
npx husky install
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'    
```

### 3、验证测试结果

``` bash
git commit -m "test"
⧗   input: test
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint

husky - commit-msg hook exited with code 1 (error)
```