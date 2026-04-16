# 共享 Web 服务器

Tailscale 允许共享 Tailscale 网络(tailnet)中设备上运行的本地服务。例如,可以提供对 Web 服务器的访问。

可以通过 Tailscale 设置共享哪些流量:来自更广泛的互联网或仅来自您的 tailnet。

## 共享服务选项

### Tailscale Funnel

使用 Tailscale Funnel 安全地将互联网流量路由到本地服务。

```bash
# 启用 Funnel
tailscale serve funnel

# 查看状态
tailscale serve status

# 共享 HTTPS
tailscale serve https-to-http :8080 --funnel
```

### Tailscale Serve

探索 Tailscale Serve 服务。

```bash
# 共享服务
tailscale serve http :8080

# 共享 HTTPS
tailscale serve https :8080

# 查看状态
tailscale serve status
```

## Tailscale Funnel vs Serve

### Tailscale Funnel

- 将互联网流量路由到本地服务
- 支持 HTTPS
- 安全暴露服务
- 无需公网 IP

```bash
# 启用 Funnel
tailscale serve funnel on

# 暴露服务
tailscale serve https-to-http :8080 --funnel

# 检查状态
tailscale serve status
```

### Tailscale Serve

- 快速共享 HTTP 服务
- 简单配置
- 本地服务共享
- Tailnet 内部访问

```bash
# 共享 HTTP
tailscale serve http :8080

# 共享 HTTPS
tailscale serve https :8080

# 查看
tailscale serve status
```

## 配置示例

### 共享本地 Web 服务器

```bash
# 使用 Funnel 公开
tailscale serve funnel on
tailscale serve https-to-http :8080 --funnel

# 或使用 Serve 仅限 Tailnet
tailscale serve http :8080
```

### 共享多个服务

```bash
# Web 服务
tailscale serve http :8080

# API 服务
tailscale serve http :3000

# 查看
tailscale serve status
```

### HTTPS 配置

```bash
# 自动 HTTPS
tailscale serve https :8080

# 查看证书
tailscale serve status
```

## 最佳实践

### 1. 安全考虑

- 限制不需要的访问
- 使用 HTTPS
- 监控访问
- 审计日志

### 2. 访问控制

- 使用 ACL 限制
- 保护敏感服务
- 审查权限

### 3. 性能

- 监控负载
- 检查延迟
- 优化配置

### 4. 文档化

- 记录共享服务
- 文档化访问
- 创建检查清单

## 故障排除

### 服务无法共享

检查步骤:

1. 确认服务正在运行
2. 验证 Tailscale 已启用
3. 检查防火墙规则
4. 查看日志

### 访问问题

- 检查 ACL 规则
- 验证权限
- 确认服务健康
- 查看网络日志

### HTTPS 问题

- 检查证书
- 验证配置
- 确认域名
- 查看错误日志

## 扩展阅读

- [Tailscale 服务](/features/tailscale-services) - 服务功能
- [Tailscale Funnel](/features/tailscale-funnel) - 公网暴露
- [访问控制](/features/access-control) - ACL 管理

## 下一步

- [Tailscale Serve](/features/tailscale-serve) - HTTP 服务共享
- [Tailscale Funnel](/features/tailscale-funnel) - 公网暴露服务
- [服务](/features/services) - 端点收集
