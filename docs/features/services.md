# 服务端点收集

Tailscale 的端点收集功能让您监控和轻松连接到 Tailscale 网络中机器上运行的端点。

## 什么是端点?

端点是在每个 Tailscale 机器上运行的网络暴露端口,由其`端口`和`协议`定义。如果网络启用了端点收集,每个机器都会将其活动的端点列表与 Tailscale 网络共享。

## 启用端点收集

此功能默认禁用。在管理控制台的[服务](https://login.tailscale.com/admin/services)页面,选择"Discovered"选项卡后,可以更改此设置。

## 监控端点

启用端点收集后,管理控制台将显示网络上的端点列表。

端点表在每台机器的详细信息页面上也可见,仅显示该机器暴露的端点。

### 端点类型

端点表包括一个 `type` 列,用于帮助您识别:

- HTTP/HTTPS
- SSH
- VNC
- RDP
- 其他

## 启动端点

从端点表,可以直接启动某些应用程序:

- SSH:显示可复制的 `ssh 100.x.y.z` 命令
- VNC/RDP:显示一个选择的"启动"按钮
- HTTP/HTTPS:显示一个选择的"打开"按钮

## 访问控制

可以使用[Tailscale 访问控制策略](/features/access-control)配置每个端点的访问权限。

## 示例配置

### 默认行为

端点收集自动收集暴露的端口和协议。

### 自定义配置

使用管理控制台的"Discovered"选项卡管理端点收集。

## 最佳实践

### 1. 监控关键服务

- 监控生产服务
- 跟踪新端点
- 检测异常端点

### 2. 访问控制

- 限制端点访问
- 定期审查
- 使用最小权限

### 3. 安全考虑

- 监控未授权端点
- 及时关闭不需要的端点
- 使用 ACL 限制访问

### 4. 文档化

- 记录业务端点
- 文档化例外
- 创建检查清单

## 故障排除

### 端点未显示

检查步骤:

1. 确认端点收集已启用
2. 验证服务正在运行
3. 检查机器在线
4. 查看网络连接

### 访问问题

- 检查 ACL 规则
- 验证端点配置
- 确认服务健康
- 查看网络日志

## 扩展阅读

- [Tailscale 服务](/features/tailscale-services) - 服务功能
- [访问控制](/features/access-control) - ACL 管理
- [MagicDNS](/features/magicdns) - DNS 解析

## 下一步

- [Tailscale Serve](/features/tailscale-serve) - HTTP 服务共享
- [Tailscale Funnel](/features/tailscale-funnel) - 公网暴露
- [服务](/features/services) - 服务详细信息
