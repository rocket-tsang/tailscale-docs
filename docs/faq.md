# FAQ - 常见问题

## 基础问题

### 什么是 Tailscale?

Tailscale 是一个零信任网络工具,基于 WireGuard 协议,可以轻松创建安全的点对点网络。

### Tailscale 免费版有哪些限制?

- 最多 3 个用户
- 最多 100 台设备
- 基础功能支持

## 安装问题

### 如何卸载 Tailscale?

**Linux**:
```bash
sudo apt-get remove tailscale
# 或
sudo yum remove tailscale
```

**macOS**:
- 从 applications 文件夹拖拽 Tailscale 到废纸篓
- 或使用命令: `sudo /Applications/Tailscale.app/Contents/Resources/uninstall.sh`

### 安装后服务无法启动

```bash
# 检查端口 41641 是否被占用
sudo lsof -i :41641

# 查看日志
journalctl -u tailscaled -n 50
```

## 使用问题

### 如何查找设备 IP?

```bash
tailscale status
```

### 如何临时关闭连接?

```bash
tailscale down
```

### 如何清除登录状态?

```bash
tailscale logout
```

## 高级功能

### 什么是出口节点?

出口节点可以将所有网络流量路由到指定设备,实现 VPN 功能。

### 如何配置子网路由器?

1. 在设备上启用子网路由
2. 在控制台配置宣告的子网
3. 在 ACL 中允许相关流量

## 性能问题

### 为什么连接速度慢?

- 检查是否有 DERP 中继参与
- 确保设备间有直接连接路径
- 查看网络质量: `tailscale status`

## 安全问题

### Tailscale 安全吗?

Tailscale 使用 WireGuard 协议,提供端到端加密,安全性高。

### 如何重置账户?

进入控制台,在组织设置中选择重置选项。
