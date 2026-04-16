# 在 Linux 上安装 Tailscale

本指南介绍如何在 Linux 系统上安装和配置 Tailscale。

## 系统要求

- Linux 内核 3.10 或更高版本
- 支持的发行版:Ubuntu、Debian、CentOS、RHEL、Fedora、Arch Linux 等

## 安装方法

### 方法一:一键安装脚本(推荐)

最简单的方式是使用官方安装脚本:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

这个脚本会:
- 检测您的 Linux 发行版
- 添加 Tailscale 的软件源
- 安装 Tailscale 包

### 方法二:发行版特定安装

<Tabs>
<Tab title="Ubuntu/Debian">

1. 添加 Tailscale 软件源:

```bash
curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/jammy.noarmor.gpg | sudo tee /usr/share/keyrings/tailscale-archive-keyring.gpg >/dev/null
curl -fsSL https://pkgs.tailscale.com/stable/ubuntu/jammy.tailscale-keyring.list | sudo tee /etc/apt/sources.list.d/tailscale.list
```

2. 安装 Tailscale:

```bash
sudo apt-get update
sudo apt-get install tailscale
```

</Tab>
<Tab title="CentOS/RHEL">

1. 添加 Tailscale 软件源:

```bash
sudo yum install yum-utils
sudo yum-config-manager --add-repo https://pkgs.tailscale.com/stable/centos/7/tailscale.repo
```

2. 安装 Tailscale:

```bash
sudo yum install tailscale
```

</Tab>
<Tab title="Fedora">

1. 添加 Tailscale 软件源:

```bash
sudo dnf config-manager --add-repo https://pkgs.tailscale.com/stable/fedora/tailscale.repo
```

2. 安装 Tailscale:

```bash
sudo dnf install tailscale
```

</Tab>
<Tab title="Arch Linux">

使用 AUR 安装:

```bash
yay -S tailscale
```

或手动安装:

```bash
git clone https://aur.archlinux.org/tailscale.git
cd tailscale
makepkg -si
```

</Tab>
</Tabs>

## 配置 Tailscale

### 1. 启动服务

启用并启动 Tailscale 服务:

```bash
sudo systemctl enable --now tailscaled
```

### 2. 连接到 tailnet

使用以下命令连接到您的网络:

```bash
sudo tailscale up
```

这将:
- 生成一个认证密钥
- 打开浏览器窗口进行身份验证
- 将您的设备连接到 tailnet

### 3. 验证连接

检查连接状态:

```bash
tailscale status
```

输出示例:

```
100.100.100.100   your-device-name  your-email@domain.com  linux -
100.101.102.103  other-device      your-email@domain.com  windows -
```

## 高级配置

### 使用认证密钥(无交互)

创建一个认证密钥并使用它连接:

```bash
sudo tailscale up --authkey=tskey-xxxxxxxxxxxx
```

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

## 故障排除

### 检查服务状态

```bash
sudo systemctl status tailscaled
```

### 查看日志

```bash
sudo journalctl -u tailscaled -f
```

### 重启服务

```bash
sudo systemctl restart tailscaled
```

## 下一步

- [快速入门](/getting-started/quickstart) - 完整的入门指南
- [子网路由器](/features/subnet-routers) - 配置子网路由器
- [出口节点](/features/exit-nodes) - 配置出口节点