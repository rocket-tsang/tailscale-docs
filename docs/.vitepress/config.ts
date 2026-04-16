import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Tailscale 中文文档',
  description: 'Tailscale 中文文档 - 零信任身份连接平台',
  lang: 'zh-CN',
  
  ignoreDeadLinks: true,
  
  outDir: '../dist',
  
  head: [
    ['meta', { name: 'theme-color', content: '#5c6bc0' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: 'Tailscale 中文文档' }],
    ['meta', { name: 'og:description', content: 'Tailscale 中文文档 - 零信任身份连接平台' }]
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Tailscale 中文文档',
    
    nav: [
      { text: '快速开始', link: '/getting-started/quickstart' },
      { text: '安装', link: '/install/' },
      { text: '概念', link: '/concepts/what-is-tailscale' },
      { text: '功能', link: '/features/' },
      { text: '管理', link: '/manage/users' },
      {
        text: '更多',
        items: [
          { text: '参考文档', link: '/reference/' },
          { text: '故障排除', link: '/troubleshooting/' },
          { text: 'FAQ', link: '/faq' }
        ]
      }
    ],

    sidebar: {
      '/getting-started/': [
        {
          text: '快速开始',
          items: [
            { text: '快速入门', link: '/getting-started/quickstart' }
          ]
        }
      ],
      '/install/': [
        {
          text: '安装',
          items: [
            { text: '概览', link: '/install/' },
            { text: 'Linux', link: '/install/linux' },
            { text: 'Windows', link: '/install/windows' },
            { text: 'macOS', link: '/install/macos' },
            { text: 'Docker', link: '/install/docker' },
            { text: 'Kubernetes', link: '/install/kubernetes' },
            { text: 'Cloud 服务器', link: '/install/cloud' }
          ]
        }
      ],
      '/concepts/': [
        {
          text: '概念',
          items: [
            { text: '什么是 Tailscale?', link: '/concepts/what-is-tailscale' },
            { text: '核心概念', link: '/concepts/core-concepts' }
          ]
        }
      ],
      '/features/': [
        {
          text: '功能',
          items: [
            { text: '概览', link: '/features/' },
            { text: 'ACL 访问控制', link: '/features/access-control' },
            { text: '子网路由器', link: '/features/subnet-routers' },
            { text: '出口节点', link: '/features/exit-nodes' },
            { text: 'MagicDNS', link: '/features/magicdns' },
            { text: 'Taildrop', link: '/features/taildrop' },
            { text: 'Kubernetes Operator', link: '/features/kubernetes-operator' },
            { text: '日志', link: '/features/logging' },
            { text: '标签', link: '/features/tags' },
            { text: '服务', link: '/features/services' },
            { text: '临时节点', link: '/features/ephemeral-nodes' },
            { text: '共享 Web 服务器', link: '/features/share-web-server' },
            { text: 'Tailscale 工具', link: '/features/tools' },
            { text: '密钥过期', link: '/features/key-expiry' }
          ]
        }
      ],
      '/manage/': [
        {
          text: '管理',
          items: [
            { text: '用户管理', link: '/manage/users' },
            { text: '设备管理', link: '/manage/devices' }
          ]
        }
      ],
      '/reference/': [
        {
          text: '参考',
          items: [
            { text: '概览', link: '/reference/' },
            { text: 'CLI 参考', link: '/reference/cli' },
            { text: 'API 参考', link: '/reference/api' }
          ]
        }
      ],
      '/troubleshooting/': [
        {
          text: '故障排除',
          items: [
            { text: '故障排除', link: '/troubleshooting/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tailscale/tailscale' }
    ],

    footer: {
      message: '基于 Tailscale 官方文档翻译',
      copyright: 'Copyright © 2026 Tailscale Inc. 保留所有权利'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      }
    },

    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
  }
})