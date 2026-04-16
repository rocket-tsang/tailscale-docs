# 在 macOS 上安装 Tailscale

本指南介绍如何在 macOS 系统上安装和配置 Tailscale。

## 系统要求

- macOS 10.15 (Catalina) 或更高版本
- 管理员权限(用于安装)

## 安装方法

### 方法一:App Store(推荐)

1. 打开 [Mac App Store](https://apps.apple.com/app/tailscale/id1475387142)
2. 点击"获取"或"安装"
3. 安装完成后启动 Tailscale

### 方法二:Homebrew

使用 Homebrew 安装:

```bash
brew install --cask tailscale
```

### 方法三:手动下载

1. 访问 [Tailscale 下载页面](https://tailscale.com/download)
2. 下载 macOS 版本
3. 打开 `.dmg` 文件
4. 将 Tailscale 拖到 Applications 文件夹

## 配置 Tailscale

### 1. 启动 Tailscale

安装完成后,Tailscale 会自动启动。您可以在菜单栏中看到 Tailscale 图标。

### 2. 连接到 tailnet

1. 点击菜单栏中的 Tailscale 图标
2. 点击"Log in"
3. 在浏览器中完成身份验证
4. 连接成功后,图标会显示绿色勾号

### 3. 验证连接

打开终端并运行:

```bash
tailscale status
```

输出示例:

```
100.100.100.100   your-device-name  your-email@domain.com  macOS -
100.101.102.103  other-device      your-email@domain.com  linux -
```

## 命令行工具

Tailscale 在 macOS 上提供完整的命令行支持。

### 查看状态

```bash
tailscale status
```

### 连接到网络

```bash
sudo tailscale up
```

### 断开连接

```bash
tailscale down
```

### 查看IP地址

```bash
tailscale ip
```

### Ping 其他设备

```bash
tailscale ping other-device
```

## 高级配置

### 设置为出口节点

将此设备配置为出口节点:

```bash
sudo tailscale up --advertise-exit-node
```

然后在管理控制台中批准此设备作为出口节点。

### 设置子网路由器

将此设备配置为子网路由器:

```bash
sudo tailscale up --advertise-routes=192.168.1.0/24
```

### 使用认证密钥(无交互)

创建一个认证密钥并使用它连接:

```bash
sudo tailscale up --authkey=tskey-xxxxxxxxxxxx
```

### 配置 macOS 防火墙

如果您启用了 macOS 防火墙,需要允许 Tailscale:

1. 打开"系统设置">"网络">"防火墙"
2. 点击"选项"
3. 确保 Tailscale 在允许的应用列表中

## 故障排除

### Tailscale 服务未运行

检查服务状态:

```bash
launchctl list | grep tailscale
```

启动服务:

```bash
sudo launchctl load /Library/LaunchDaemons/com.tailscale.tailscaled.plist
```

### 权限问题

如果遇到权限问题,重新授予网络扩展权限:

1. 打开"系统设置">"隐私与安全性">"网络扩展"
2. 确保 Tailscale 被允许

### 日志位置

Tailscale 日志位于:

```
/Library/Logs/Tailscale
```

查看日志:

```bash
log show --predicate 'process == "tailscaled"' --last 1h
```

### 卸载和重装

如果遇到问题,可以尝试重装:

使用 Homebrew:

```bash
brew uninstall --cask tailscale
brew install --cask tailscale
```

手动卸载:

```bash
sudo /Applications/Tailscale.app/Contents/MacOS/Tailscale uninstall
```

然后重新下载并安装。

## 下一步

- [快速入门](/getting-started/quickstart) - 完整的入门指南
- [子网路由器](/features/subnet-routers) - 配置子网路由器
- [出口节点](/features/exit-nodes) - 配置出口节点