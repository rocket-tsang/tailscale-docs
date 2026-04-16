# 故障排除

本文档介绍 Tailscale 常见问题和解决方案。

## 常见问题

### 1. 无法连接到网络

**问题**: 运行 `tailscale up` 后无法访问网络

**解决方案**:

```bash
# 检查连接状态
tailscale status

# 重启 Tailscale 服务
sudo systemctl restart tailscaled

# 检查防火墙设置
sudo ufw status
```

### 2. 设备不显示在线

**问题**: 设备在 Tailscale 控制台显示为离线

**解决方案**:

```bash
# 检查服务状态
sudo systemctl status tailscaled

# 重新连接
tailscale down
tailscale up
```

### 3. 无法访问子网资源

**问题**: 无法访问子网路由器后面的设备

**解决方案**:

- 确保子网路由器已正确配置
- 检查 ACL 规则是否允许访问
- 验证网络路由设置

## 平台特定问题

### Linux

```bash
# 检查服务状态
sudo systemctl status tailscaled

# 查看日志
journalctl -u tailscaled -f
```

### Windows

1. 打开服务管理器
2. 找到 Tailscale 服务
3. 检查服务状态并重启

### macOS

```bash
# 重启 Tailscale
sudo launchctl stop com.tailscale.tailscaled
sudo launchctl start com.tailscale.tailscaled
```

## 获取帮助

- [Tailscale 官方支持](https://tailscale.com/support)
- [GitHub Issues](https://github.com/tailscale/tailscale/issues)
- [社区论坛](https://discuss.tailscale.com)
