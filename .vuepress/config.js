const { githubClientId, githubClientSecret } = require('../config')

module.exports = {
  title: 'Yumcc\'s Blog', // Title for the site. This will be displayed in the navbar.
  theme: '@vuepress/theme-blog',
  themeConfig: {
    dateFormat: 'YYYY-MM-DD',
    nav: [
      {
        text: 'Blog',
        link: '/'
      },
      {
        text: 'Tags',
        link: '/tag/'
      }
    ],
    footer: {
      contact: [
        {
          type: 'github',
          link: 'https://github.com/yumcc-com',
        },
        {
          type: 'instagram',
          link: 'https://www.instagram.com/yumcc_com',
        },
        {
          type: 'mail',
          link: 'mailto:yumcc@qq.com',
        }
      ]
    }
  },
  plugins: {
    '@vssue/vuepress-plugin-vssue': {
      platform: 'github',
      owner: 'yumcc-com',
      repo: 'blog',
      clientId: githubClientId,
      clientSecret: githubClientSecret
    },
  },
}