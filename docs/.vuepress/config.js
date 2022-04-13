const path = require("path");
const fs = require("fs");

const docsPath = path.join(__dirname, "..");

function findDirDirectory(dirPath, filterDirs = []) {
  return fs
    .readdirSync(dirPath, {
      withFileTypes: true,
    })
    .filter((v) => {
      return v.isDirectory() && filterDirs.every((dir) => dir !== v.name);
    })
    .map((v) => v.name);
}

function generateSidebar(list = []) {
  const sidebar = {};

  while (list.length) {
    const sidebarName = list.shift();
    const sidebarItem = generateSidebarItem(sidebarName);
    sidebar[`/${sidebarName}/`] = sidebarItem;
  }

  return sidebar;
}

function generateSidebarItem(dirName) {
  const dirPath = path.join(__dirname, "..", dirName);

  const folderList = findDirDirectory(dirPath).sort((a, b) => {
    const splitDot = (v) => Number(v.split("、")[0]);
    const numberA = splitDot(a);
    const numberB = splitDot(b);

    return numberA - numberB;
  });

  const sidebarItem = folderList.reduce((total, subDirName) => {
    const item = {
      title: subDirName,
      children: generateSidebarChildren(dirName, subDirName),
    };
    total.push(item);
    return total;
  }, []);

  return sidebarItem;
}

function generateSidebarChildren(basePath, subModule) {
  const mdModule = path.join(__dirname, "../", basePath, subModule);
  const moduleDirs = fs.readdirSync(mdModule);
  return moduleDirs.map((dirName) => `/${basePath}/${subModule}/${dirName}`);
}

const folderList = findDirDirectory(docsPath, [".vuepress"]);

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
    sidebar: generateSidebar(folderList), //{
    // "/frontend-engineering/": [
    //   {
    //     title: '一、HTML/CSS',
    //     children: getChildrens('interview-questions', 'html&css')
    //   },
    // ],
    // "/interview-questions/": [
    //   {
    //     title: '一、HTML/CSS',
    //     children: getChildrens('interview-questions', 'html&css')
    //   },
    //   {
    //     title: '二、HTTP',
    //     children: getChildrens('interview-questions', 'http')
    //   },
    //   {
    //     title: '三、JavaScript',
    //     children: getChildrens('interview-questions', 'js')
    //   },
    //   {
    //     title: '四、ES6',
    //     children: getChildrens('interview-questions', 'es6')
    //   },
    //   {
    //     title: '五、Async',
    //     children: getChildrens('interview-questions', 'async')
    //   },
    //   {
    //     title: '六、WriteCode',
    //     children: getChildrens('interview-questions', 'write-code')
    //   },
    //   {
    //     title: '七、Mobile',
    //     children: getChildrens('interview-questions', 'mobile')
    //   },
    //   {
    //     title: '八、Vue2',
    //     children: getChildrens('interview-questions', 'vue2')
    //   },
    //   {
    //     title: '九、Vue3',
    //     children: getChildrens('interview-questions', 'vue3')
    //   },
    //   {
    //     title: '十、Engineering',
    //     children: getChildrens('interview-questions', 'engineering')
    //   },
    //   {
    //     title: '十一、Git',
    //     children: getChildrens('interview-questions', 'git')
    //   },
    //   {
    //     title: '十二、Algorithm',
    //     children: getChildrens('interview-questions', 'algorithm')
    //   },
    //   {
    //     title: '十三、DesignMode',
    //     children: getChildrens('interview-questions', 'design-mode')
    //   },
    //   {
    //     title: '十四、TypeScript',
    //     children: getChildrens('interview-questions', 'typescript')
    //   },
    //   {
    //     title: '十五、react',
    //     children: getChildrens('interview-questions', 'react')
    //   }
    // ]
    // }
    // "/data-structure-and-algorithm/": [
    //   {
    //     title: "数据结构与算法",
    //     path: "/data-structure-and-algorithm/stack/",
    //     children: [
    //       "stack",
    //       "queue",
    //       "priority-queue",
    //       "linked-list",
    //       "doubly-linked-list",
    //       "binary-tree",
    //     ],
    //   },
    // ],
    // "/frontend-engineering/": [
    //   {
    //     title: "前端工程化",
    //     path: "/frontend-engineering/git/",
    //     children: ["git"],
    //   },
    // ],
    // },
  },
};
