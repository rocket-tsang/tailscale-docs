# AGENTS.md - AI 助手项目指南

本文档为 AI 助手（如 opencode）提供项目开发指南和注意事项。

## 项目概述

这是一个基于 **VitePress 1.6.4** 构建的 Tailscale 官方文档中文翻译网站。

- **项目类型**: 静态文档网站
- **技术栈**: VitePress (Vue.js)、Markdown、Node.js (ESM)
- **主要目标**: 提供完整、准确的 Tailscale 中文文档
- **部署方式**: 静态网站，可部署到任何静态托管平台

## 关键信息

### 技术栈版本

- **VitePress**: 1.6.4 (最新稳定版)
- **Node.js**: 需支持 ESM (package.json 中已设置 `"type": "module"`)
- **Markdown**: 标准 Markdown + VitePress 扩展

### 项目结构

```
docs/
├── .vitepress/config.ts  # VitePress 配置文件
├── public/logo.svg       # 网站 Logo
├── index.md              # 首页
├── getting-started/      # 快速开始
├── install/              # 安装指南
├── concepts/             # 概念介绍
├── features/             # 功能详解
├── manage/               # 管理指南
└── reference/            # 参考文档
```

### 已创建的文档

目前共有 **18 个文档页面**:

- 1 个首页
- 1 个快速入门
- 4 个安装指南
- 2 个概念介绍
- 4 个功能详解
- 2 个管理指南
- 3 个参考文档

## 开发命令

### 必须运行的命令

在开始工作前，请运行以下命令:

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev
```

### 常用命令

```bash
# 开发模式（本地开发）
npm run docs:dev
# 访问: http://localhost:5173

# 构建生产版本
npm run docs:build
# 输出: docs/.vitepress/dist/

# 预览构建结果
npm run docs:preview
# 访问: http://localhost:4173
```

### 重要提示

⚠️ **构建时忽略死链接**: 
- 已在 `config.ts` 中设置 `ignoreDeadLinks: true`
- 因为部分文档链接尚未创建完整内容
- 完成所有文档后可移除此配置

⚠️ **ESM 模块要求**:
- `package.json` 必须包含 `"type": "module"`
- 否则 VitePress 无法正常运行

## 开发规范

### 文档编写规范

1. **语言**: 使用简体中文编写
2. **格式**: Markdown 格式
3. **标题层级**: 合理使用 H1-H6
4. **代码块**: 使用语法高亮（bash、typescript、json 等）
5. **示例**: 提供实际可用的代码示例
6. **链接**: 使用相对路径（`/path/to/page`）

### VitePress 特殊语法

可以使用 VitePress 的扩展功能:

```markdown
<!-- Tabs 组件 -->
<Tabs>
<Tab title="Linux">
内容
</Tab>
<Tab title="Windows">
内容
</Tab>
</Tabs>

<!-- 自定义容器 -->
::: tip 提示
提示内容
:::

::: warning 注意
注意内容
:::

::: danger 危险
危险内容
:::
```

### 文件命名规范

- 使用小写字母
- 使用连字符分隔（`-`）
- 示例: `quickstart.md`, `access-control.md`

### 路径配置

在 VitePress 中:

- 文件路径: `docs/install/index.md`
- URL 路径: `/install/` 或 `/install/index.html`
- 配置链接: `link: '/install/'`

**重要**: 侧边栏和导航的 `link` 路径要以 `/` 开头，以 `/` 结尾（对于 index.md）

## 配置文件说明

### VitePress 配置 (`docs/.vitepress/config.ts`)

主要配置项:

```typescript
{
  title: 'Tailscale 中文文档',
  description: 'Tailscale 中文文档 - 零信任身份连接平台',
  lang: 'zh-CN',
  ignoreDeadLinks: true,  // 忽略死链接
  
  themeConfig: {
    nav: [...],            // 导航栏
    sidebar: {...},        // 侧边栏（分章节）
    search: {...},         // 本地搜索（中文）
    footer: {...},         // 页脚
    socialLinks: [...]     // 社交链接
  }
}
```

### Package.json 配置

```json
{
  "name": "tailscale-docs-zh",
  "type": "module",  // ⚠️ 必须保留
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  }
}
```

## 常见问题和解决方案

### 问题 1: 构建失败 "ESM file cannot be loaded by require"

**原因**: 缺少 `"type": "module"` 配置

**解决**: 在 `package.json` 中添加 `"type": "module"`

### 问题 2: 页面 404 错误

**可能原因**:
- 文件路径不正确
- 侧边栏配置链接错误
- 文件未创建

**解决方案**:
1. 检查文件是否存在: `docs/path/to/file.md`
2. 检查配置中的链接格式: `link: '/path/'`
3. 确保路径以 `/` 开头和结尾（对于目录）

### 问题 3: 死链接警告

**原因**: 部分文档链接指向尚未创建的页面

**解决方案**:
- 添加 `ignoreDeadLinks: true` 到配置（已添加）
- 或创建缺失的文档页面

### 问题 4: 最大调用堆栈溢出

**原因**: 首页使用了 `<Content />` 组件导致循环

**解决**: 移除 `<Content />`，只保留 frontmatter 和 style

## 添加新文档的步骤

### 步骤 1: 创建 Markdown 文件

```bash
# 创建目录（如需要）
mkdir -p docs/new-section

# 创建文件
touch docs/new-section/new-page.md
```

### 步骤 2: 编写文档内容

```markdown
# 页面标题

内容...

## 第一节

内容...

### 示例

```bash
代码示例
```
```

### 步骤 3: 更新配置

在 `docs/.vitepress/config.ts` 中添加:

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

**注意**: 如果是 index.md，使用 `link: '/new-section/'`

### 步骤 4: 测试

```bash
npm run docs:dev
# 访问页面检查是否正常显示
```

## 翻译指南

### 翻译原则

1. **准确性**: 保持技术术语的准确翻译
2. **一致性**: 同一术语在不同页面使用相同翻译
3. **可读性**: 使用流畅的中文表达
4. **完整性**: 翻译完整内容，不要遗漏重要信息

### 术语对照表

| 英文 | 中文 | 备注 |
|------|------|------|
| Tailscale | Tailscale | 保留原文 |
| WireGuard | WireGuard | 保留原文 |
| VPN | VPN | 保留原文 |
| tailnet | tailnet / 网络 | 视上下文 |
| ACL | ACL / 访问控制列表 | |
| subnet router | 子网路由器 | |
| exit node | 出口节点 | |
| DERP | DERP / 中继服务器 | |
| node | 节点 | |
| device | 设备 | |
| auth key | 认证密钥 | |
| MagicDNS | MagicDNS | 保留原文 |

### 翻译注意事项

- 保留品牌名称和协议名称的英文原文
- 技术参数、命令、代码不要翻译
- 保持原文的结构和层级
- 添加必要的中文说明和示例

## 代码风格

### TypeScript/Vue 配置

- 使用 2 空格缩进
- 使用单引号
- 对象最后一个属性不加分号
- 保持代码整洁和可读性

### Markdown 文档

- 标题前后保持空行
- 列表项之间保持一致的间距
- 代码块指定语言类型
- 使用相对路径链接

## 性能优化建议

### 构建优化

- 定期清理缓存: 删除 `docs/.vitepress/cache`
- 减少不必要的图片和大型文件
- 使用轻量级的 SVG 图标

### 内容优化

- 合理分页，避免单个页面过长
- 使用目录导航（outline）
- 提供清晰的标题层级

## 部署检查清单

部署前检查:

- ✅ `npm run docs:build` 成功构建
- ✅ 检查关键页面是否正常（首页、安装、概念等）
- ✅ 搜索功能是否正常
- ✅ 导航和侧边栏是否完整
- ✅ 图片和 Logo 是否显示
- ✅ 深色模式切换是否正常
- ✅ 移动端响应式是否正常

## 待完成任务

目前项目还有以下待完善内容:

### 高优先级

1. 修复安装指南页面 404（如有）
2. 添加缺失的文档页面链接
3. 完善 CLI 参考文档
4. 完善 API 参考文档

### 中优先级

1. 添加更多平台安装指南（Docker、Kubernetes）
2. 添加 MagicDNS 文档
3. 添加 Tailscale SSH 文档
4. 添加故障排除指南
5. 添加 FAQ 页面

### 低优先级

1. 优化 SEO 配置
2. 添加更多示例和案例
3. 创建术语表页面
4. 添加最佳实践指南
5. 优化主题样式

## 项目状态

- **开发状态**: 活跃开发中
- **完成度**: 约 40%（核心文档已完成）
- **文档数量**: 18 个页面
- **构建状态**: ✅ 成功
- **运行状态**: ✅ 正常

## 联系和支持

- **GitHub**: https://github.com/tailscale/tailscale
- **官方文档**: https://tailscale.com/docs
- **VitePress 文档**: https://vitepress.dev

---

**最后更新**: 2026-04-16
**维护者**: AI 助手 + 开发者
**版本**: 1.0.0