# Tailscale 中文文档

基于 VitePress 构建的 Tailscale 官方文档中文翻译网站。

## 项目概述

本项目使用 VitePress 最新版本搭建了一个完整的 Tailscale 文档中文网站,包含:

- 快速入门指南
- 安装教程(Linux、Windows、macOS、Docker、Kubernetes、Cloud)
- 核心概念介绍
- 功能详解(ACL、子网路由器、出口节点、MagicDNS、Taildrop等)
- 用户和设备管理
- CLI 和 API 参考
- 故障排除和 FAQ

## 技术栈

- **VitePress**: 最新版本 (1.6.4)
- **Node.js**: 支持 ESM 模块
- **Markdown**: 所有文档使用 Markdown 格式

## 项目结构

```
tailscale/
├── docs/
│   ├── .vitepress/
│   │   └── config.ts          # VitePress 配置文件
│   ├── public/
│   │   └── logo.svg           # 网站 Logo
│   ├── index.md               # 首页
│   ├── getting-started/       # 快速开始
│   │   └── quickstart.md
│   ├── install/               # 安装指南
│   │   ├── index.md
│   │   ├── linux.md
│   │   ├── windows.md
│   │   ├── macos.md
│   │   ├── docker.md
│   │   ├── kubernetes.md
│   │   └── cloud.md
│   ├── concepts/              # 概念介绍
│   │   ├── what-is-tailscale.md
│   │   └── core-concepts.md
│   ├── features/              # 功能详解
│   │   ├── index.md
│   │   ├── access-control.md
│   │   ├── subnet-routers.md
│   │   ├── exit-nodes.md
│   │   ├── magicdns.md
│   │   ├── taildrop.md
│   │   ├── services.md
│   │   ├── logging.md
│   │   ├── tags.md
│   │   ├── ephemeral-nodes.md
│   │   ├── key-expiry.md
│   │   ├── tools.md
│   │   ├── share-web-server.md
│   │   ├── kubernetes-operator.md
│   │   └── ssh.md
│   ├── manage/                # 管理指南
│   │   ├── users.md
│   │   └── devices.md
│   ├── reference/             # 参考文档
│   │   ├── index.md
│   │   ├── cli.md
│   │   └── api.md
│   ├── troubleshooting/       # 故障排除
│   │   └── index.md
│   └── faq.md                 # 常见问题
├── package.json
└── README.md
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

启动本地开发服务器:

```bash
npm run docs:dev
```

访问 `http://localhost:5173` 查看网站。

### 构建生产版本

构建静态网站:

```bash
npm run docs:build
```

构建产物位于 `docs/.vitepress/dist` 目录。

### 预览构建结果

预览构建后的网站:

```bash
npm run docs:preview
```

访问 `http://localhost:4173` 查看预览。

## 功能特性

### 已实现功能

✅ 完整的 VitePress 配置
✅ 中文导航和侧边栏
✅ 本地搜索功能(中文界面)
✅ 响应式设计
✅ 深色模式支持
✅ 首页 Hero 展示
✅ 核心文档翻译(约 34 个页面)

### 文档内容

- **快速入门**: 帮助用户快速了解和使用 Tailscale
- **安装指南**: 支持 Linux、Windows、macOS、Docker、Kubernetes、Cloud 服务器
- **概念介绍**: 详细解释 Tailscale 的核心概念和术语
- **功能详解**: ACL、子网路由器、出口节点、MagicDNS、Taildrop、服务等
- **管理指南**: 用户和设备管理的完整教程
- **技术参考**: CLI 和 API 的详细文档
- **故障排除**: 常见问题和解决方案
- **FAQ**: 常见问题解答

## 配置说明

### VitePress 配置

主要配置包括:

- **国际化**: 中文界面、搜索、导航
- **主题定制**: Logo、颜色、布局
- **侧边栏**: 每个章节独立的侧边栏
- **导航栏**: 主导航和下拉菜单
- **搜索**: 本地搜索,中文界面
- **SEO**: Meta 标签、Open Graph

### 自定义配置

修改 `docs/.vitepress/config.ts` 可以:

- 调整导航和侧边栏结构
- 修改主题颜色和样式
- 添加新的文档页面
- 配置 SEO 信息

## 部署建议

### 静态托管

构建后的网站是纯静态文件,可以部署到:

- **GitHub Pages**: 免费,适合开源项目
- **Netlify**: 自动构建,CDN 加速
- **Vercel**: 自动构建,性能优化
- **Cloudflare Pages**: 全球 CDN
- **自有服务器**: Nginx/Apache

### 部署步骤

1. 构建网站:

```bash
npm run docs:build
```

2. 上传 `docs/.vitepress/dist` 目录到托管平台

3. 配置域名和 SSL

## 开发指南

### 添加新页面

1. 创建新的 Markdown 文件:

```bash
touch docs/new-section/new-page.md
```

2. 在配置文件中添加侧边栏:

```typescript
sidebar: {
  '/new-section/': [
    {
      text: '新章节',
      items: [
        { text: '新页面', link: '/new-section/new-page' }
      ]
    }
  ]
}
```

3. 编写文档内容

### 文档编写规范

- 使用中文编写
- 保持简洁明了
- 使用示例和代码块
- 添加适当的标题层级
- 使用 VitePress 的 Markdown 扩展功能(如 Tabs、Badge 等)

## 翻译说明

### 翻译来源

文档基于 Tailscale 官方文档翻译:
- 来源: https://tailscale.com/docs
- 翻译状态: 核心文档已翻译
- 更新频率: 随官方文档更新

### 翻译原则

- 保持技术准确性
- 使用中文技术术语
- 保留英文专业名词(如 WireGuard、VPN)
- 保持原文结构和逻辑

## 贡献指南

欢迎贡献和完善文档:

1. Fork 本项目
2. 创建新的分支
3. 添加或修改文档
4. 提交 Pull Request

### 贡献内容

- 翻译新的文档页面
- 修正翻译错误
- 添加示例和案例
- 改进文档结构
- 优化配置和主题

## 许可证

本项目基于 Tailscale 官方文档翻译,遵循以下许可:

- **Tailscale 文档**: Copyright © 2026 Tailscale Inc.
- **本项目代码**: MIT License

## 联系方式

- **GitHub Issues**: 提交问题和建议
- **官方文档**: https://tailscale.com/docs
- **社区**: https://github.com/tailscale/tailscale

## 致谢

感谢以下项目和组织:

- **Tailscale**: 提供优秀的 VPN 解决方案和文档
- **VitePress**: 提供出色的文档站点生成工具
- **Vue.js**: VitePress 的基础框架

---

**最后更新**: 2026-04-16
**VitePress 版本**: 1.6.4
**Node.js 要求**: 支持 ESM 的版本
**文档数量**: 34 个页面
**构建状态**: ✅ 成功
# tailscale-docs
