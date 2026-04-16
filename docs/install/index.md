# 安装 Tailscale

Tailscale 可以在多种平台上运行。选择您的平台开始安装。

## 支持的平台

### 桌面操作系统

- [Linux](/install/linux) - Ubuntu、Debian、CentOS、Fedora 等
- [Windows](/install/windows) - Windows 10 及以上版本
- [macOS](/install/macos) - macOS 10.15 (Catalina) 及以上版本

### 移动设备

- iOS - 从 [App Store](https://apps.apple.com/app/tailscale/id1475387142) 下载
- Android - 从 [Google Play](https://play.google.com/store/apps/details?id=com.tailscale.ipn) 下载

### 服务器和容器

- [Docker](/install/docker) - 在 Docker 容器中运行 Tailscale
- [Kubernetes](/install/kubernetes) - 在 Kubernetes 集群中使用 Tailscale
- [Cloud Servers](/install/cloud) - AWS、GCP、Azure 等

### 其他平台

- BSD - FreeBSD、OpenBSD
- NAS - Synology、QNAP
- 路由器 - OpenWrt、Ubiquiti

## 安装方法

### 方法一:一键安装脚本(推荐)

最简单的安装方式是使用官方安装脚本:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

这个脚本会自动检测您的操作系统并安装合适的版本。

### 方法二:包管理器

使用您系统的包管理器安装:

<Tabs>
<Tab title="Ubuntu/Debian">

```bash
sudo apt-get update
sudo apt-get install tailscale
```

</Tab>
<Tab title="CentOS/RHEL">

```bash
sudo yum install tailscale
```

或使用 dnf:

```bash
sudo dnf install tailscale
```

</Tab>
<Tab title="macOS">

```bash
brew install tailscale
```

</Tab>
</Tabs>

### 方法三:下载二进制文件

从 [Tailscale 下载页面](https://tailscale.com/download) 下载适合您平台的二进制文件。

## 安装后步骤

### 1. 启动 Tailscale

安装完成后,启动 Tailscale 守护进程:

```bash
sudo tailscaled
```

### 2. 连接到 tailnet

使用以下命令连接到您的网络:

```bash
sudo tailscale up
```

这将打开浏览器窗口进行身份验证。

### 3. 验证连接

检查连接状态:

```bash
tailscale status
```

## 下一步

- [快速入门](/getting-started/quickstart) - 完整的入门指南
- [核心概念](/concepts/what-is-tailscale) - 了解 Tailscale 的工作原理
- [访问控制](/features/access-control) - 配置安全策略