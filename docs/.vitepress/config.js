const Study = require('./sidebar/study.json')
const Life = require('./sidebar/life.json')

module.exports = {
  title: "Yumcc's Blog",
  description: 'Thanks for reading my blog.',
  lang: 'zh-CN',
  themeConfig: {
    repo: 'yumcc-com',
    docsDir: 'docs',
    // 导航配置
    nav: [
      { text: '主页', link: '/' },
      { text: '学习笔记', link: '/study/' },
      { text: '生活', link: '/life/' },
      {
        text: 'Media',
        ariaLabel: '社交媒体',
        items: [
          { text: 'Instagram', link: 'https://www.instagram.com/yumcc_com' },
          { text: 'Pinterest', link: 'https://www.pinterest.com/linshicheng' },
          { text: '微博', link: 'https://weibo.com/lscasw' },
          { text: '知乎', link: 'https://www.zhihu.com/people/seemgame' },
          { text: '掘金', link: 'https://juejin.cn/user/1697301682200599' }
        ]
      }
    ],
    sidebar: {
      '/study/': Study,
      '/life/': Life
    }
  }
}
