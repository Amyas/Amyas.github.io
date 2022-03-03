module.exports = {
  title: "Amyas ' Blog",
  description: "技术沉淀",
  theme: 'reco',
  // https://vuepress-theme-reco.recoluan.com/views/1.x/configJs.html#%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%BC%98%E5%8C%96
  // 在移动端，搜索框在获得焦点时会放大，并且在失去焦点后可以左右滚动，这可以通过设置元来优化。
  head: [
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  themeConfig: {
    type: 'blog',
    author: 'Amyas',
    subSidebar: 'auto',
    lastUpdated: 'Last Updated',
    noFoundPageByTencent: false,
    nav: [
      { text: "首页", link: "/" },
      {
        text: '数据结构与算法',
        link: '/data-structure-and-algorithm/'
      },
      {
        text: '前端工程化',
        link: '/frontend-engineering/'
      },
    ],
    sidebar: {
      '/data-structure-and-algorithm/': [
        {
          title: '数据结构与算法',
          collapsable: false,
          children: [['', '前言'], 'linked-list', 'binary-tree']
        }
      ],
      '/frontend-engineering/': [
        {
          title: '前端工程化',
          collapsable: false,
          children: ['']
        }
      ],
    }
  },
};
