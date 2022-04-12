const path = require('path')
const fs = require('fs')

function getChildrens(basePath, subModule){
  const mdModule = path.join(__dirname, '../', basePath, subModule)
  const moduleDirs = fs.readdirSync(mdModule)
  return moduleDirs.map(dirName=>`/${basePath}/${subModule}/${dirName}`)
}


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
        text: "数据结构与算法",
        link: "/data-structure-and-algorithm/",
      },
    ],
    sidebar: [
      {
        title: '一、HTML/CSS',
        children: getChildrens('interview-questions', 'htmlcss')
      },
      {
        title: '二、HTTP',
        children: getChildrens('interview-questions', 'http')
      },
      {
        title: '三、JavaScript',
        children: getChildrens('interview-questions', 'js')
      },
      {
        title: '四、ES6',
        children: getChildrens('interview-questions', 'es6')
      }
    ]
    // sidebar: {
    //   "/interview-questions/": [
    //     {
    //       title: "总结",
    //       collapsable: false,
    //       sidebarDepth: 1,
    //       children: [
    //         "/interview-questions/htmlcss/1"
    //       ]
    //       // path: "/interview-questions/html/",
    //       // children: [
    //       //   "htmlcss",
    //       //   "js",
    //       //   "async",
    //       //   "seecodesaywhy",
    //       //   "writecode",
    //       //   "mobile",
    //       //   "vue",
    //       //   "engineering",
    //       //   "git",
    //       //   "algorithm",
    //       //   "typescript",
    //       //   "react",
    //       //   "http",
    //       // ],
    //     },
    //   ],
    //   "/data-structure-and-algorithm/": [
    //     {
    //       title: "数据结构与算法",
    //       path: "/data-structure-and-algorithm/stack/",
    //       children: [
    //         "stack",
    //         "queue",
    //         "priority-queue",
    //         "linked-list",
    //         "doubly-linked-list",
    //         "binary-tree",
    //       ],
    //     },
    //   ],
    //   "/frontend-engineering/": [
    //     {
    //       title: "前端工程化",
    //       path: "/frontend-engineering/git/",
    //       children: ["git"],
    //     },
    //   ],
    // },
  },
};
