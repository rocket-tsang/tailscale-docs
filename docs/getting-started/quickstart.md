# 快速入门

欢迎使用 Tailscale!本指南将帮助您在几分钟内设置您的第一个 Tailscale 网络(tailnet)。

## 什么是 Tailscale?

Tailscale 是一个零信任身份连接平台,它可以:

- 替代传统 VPN、SASE 和 PAM
- 连接远程团队、多云环境、CI/CD 流水线
- 支持边缘设备和 AI 工作负载
- 基于 WireGuard® 协议,提供企业级安全性

## 快速开始步骤

### 第一步:创建账户

1. 访问 [Tailscale 官网](https://tailscale.com)
2. 点击"Get Started"创建免费账户
3. 选择您的身份提供商(Google、Microsoft、GitHub 等)

### 第二步:安装 Tailscale

根据您的操作系统选择安装方式:

<Tabs>
<Tab title="Linux">

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

</Tab>
<Tab title="macOS">

```bash
brew install tailscale
```

或从 [App Store](https://apps.apple.com/app/tailscale/id1475387142) 下载

</Tab>
<Tab title="Windows">

从 [Tailscale 官网](https://tailscale.com/download) 下载安装程序

</Tab>
</Tabs>

### 第三步:连接到您的 tailnet

安装完成后,运行以下命令连接:

```bash
sudo tailscale up
```

这将打开浏览器窗口进行身份验证。完成后,您的设备将连接到您的 tailnet。

### 第四步:验证连接

查看您的 tailnet 状态:

```bash
tailscale status
```

您应该能看到您的设备列表及其 IP 地址。

## 下一步

- [安装指南](/install/) - 在各种平台上安装 Tailscale
- [核心概念](/concepts/what-is-tailscale) - 了解 Tailscale 的工作原理
- [访问控制](/features/access-control) - 设置安全策略
- [子网路由器](/features/subnet-routers) - 扩展您的网络

## 需要帮助?

- [常见问题](/reference/faq) - 查看常见问题解答
- [故障排除](/reference/troubleshooting) - 解决常见问题
- [社区支持](https://github.com/tailscale/tailscale) - GitHub 社区