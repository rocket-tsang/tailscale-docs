# 在 Windows 上安装 Tailscale

本指南介绍如何在 Windows 系统上安装和配置 Tailscale。

## 系统要求

- Windows 10 或更高版本
- Windows Server 2016 或更高版本
- 管理员权限(用于安装)

## 安装方法

### 方法一:图形界面安装(推荐)

1. 访问 [Tailscale 下载页面](https://tailscale.com/download)
2. 点击"Download for Windows"下载安装程序
3. 运行下载的 `.exe` 文件
4. 按照安装向导完成安装

### 方法二:命令行安装

使用 PowerShell 安装:

```powershell
# 使用 winget 安装
winget install tailscale.tailscale

# 或使用 Chocolatey 安装
choco install tailscale
```

### 方法三:便携版

下载便携版可执行文件:

1. 访问 [Tailscale 下载页面](https://tailscale.com/download)
2. 下载便携版 ZIP 文件
3. 解压到任意目录
4. 运行 `tailscale.exe`

## 配置 Tailscale

### 1. 启动 Tailscale

安装完成后,Tailscale 会自动启动。您可以在系统托盘中看到 Tailscale 图标。

### 2. 连接到 tailnet

1. 点击系统托盘中的 Tailscale 图标
2. 点击"Log in"
3. 在浏览器中完成身份验证
4. 连接成功后,图标会显示绿色勾号

### 3. 验证连接

打开 PowerShell 并运行:

```powershell
tailscale status
```

输出示例:

```
100.100.100.100   your-device-name  your-email@domain.com  windows -
100.101.102.103  other-device      your-email@domain.com  linux -
```

## 命令行操作

Tailscale 在 Windows 上也支持命令行操作:

### 查看状态

```powershell
tailscale status
```

### 连接到网络

```powershell
tailscale up
```

### 断开连接

```powershell
tailscale down
```

### 查看IP地址

```powershell
tailscale ip
```

### Ping 其他设备

```powershell
tailscale ping other-device
```

## 高级配置

### 设置为出口节点

将此设备配置为出口节点:

1. 打开管理员 PowerShell
2. 运行命令:

```powershell
tailscale up --advertise-exit-node
```

3. 在管理控制台中批准此设备作为出口节点

### 设置子网路由器

将此设备配置为子网路由器:

```powershell
tailscale up --advertise-routes=192.168.1.0/24
```

### 使用认证密钥(无交互)

创建一个认证密钥并使用它连接:

```powershell
tailscale up --authkey=tskey-xxxxxxxxxxxx
```

## 故障排除

### Tailscale 服务未运行

检查服务状态:

```powershell
Get-Service Tailscale
```

启动服务:

```powershell
Start-Service Tailscale
```

### 防火墙问题

确保 Windows 防火墙允许 Tailscale:

```powershell
# 允许 Tailscale 通过防火墙
New-NetFirewallRule -DisplayName "Tailscale" -Direction Inbound -Program "C:\Program Files\Tailscale\tailscale.exe" -Action Allow
New-NetFirewallRule -DisplayName "Tailscale" -Direction Outbound -Program "C:\Program Files\Tailscale\tailscale.exe" -Action Allow
```

### 日志位置

Tailscale 日志位于:

```
C:\ProgramData\Tailscale\Logs
```

### 重装 Tailscale

如果遇到问题,可以尝试重装:

```powershell
# 卸载
winget uninstall tailscale.tailscale

# 重新安装
winget install tailscale.tailscale
```

## 下一步

- [快速入门](/getting-started/quickstart) - 完整的入门指南
- [子网路由器](/features/subnet-routers) - 配置子网路由器
- [出口节点](/features/exit-nodes) - 配置出口节点