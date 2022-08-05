const path = require("path");
const GenerateSidebar = require("./generate-sidebar");

const docsPath = path.join(__dirname, "..");

const sidebarInstance = new GenerateSidebar(docsPath, [
  ".vuepress",
  "_hidden",
  "_test",
]);

module.exports = {
  title: "Amyas ' Blog",
  description: "技术沉淀",
  head: [
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      {
        text: "总结",
        link: "/interview-questions/",
      },
      {
        text: "前端工程化",
        link: "/frontend-engineering/",
      },
      {
        text: "设计模式",
        link: "/design-mode/",
      },
      {
        text: "数据结构与算法",
        link: "/data-structure-and-algorithm/",
      },
    ],
    sidebar: sidebarInstance.getSidebar(),
  },
};
