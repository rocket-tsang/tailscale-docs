# Tailscale 工具

Tailscale 提供多种工具和实用程序来管理和监控您的网络。

## 核心工具

### Tailscale CLI

命令行界面用于管理 Tailscale 客户端:

```bash
# 状态
tailscale status

# 连接
tailscale connect

# 日志
tailscale netcheck

# 设置
tailscale up
```

### 管理控制台

基于 Web 的管理界面:

- 设备管理
- 用户管理
- ACL 配置
- 日志查看

### API

RESTful API 用于编程访问:

```bash
# 创建设备
curl -X POST \
  https://api.tailscale.com/api/v2/device \
  -u "tskey-api-key"
```

## 参考工具

### Tailscale CLI 参考

完整的命令行参考,包括:

- [tailscale up](/reference/tailscale-cli#up) - 设置客户端
- [tailscale status](/reference/tailscale-cli#status) - 显示状态
- [tailscale connect](/reference/tailscale-cli#connect) - 连接
- [tailscale disconnect](/reference/tailscale-cli#disconnect) - 断开连接
- [tailscale logout](/reference/tailscale-cli#logout) - 登出
- [tailscale netcheck](/reference/tailscale-cli#netcheck) - 网络检查
- [tailscale ping](/reference/tailscale-cli#ping) - Ping 设备
- [tailscale bugreport](/reference/tailscale-cli#bugreport) - 生成错误报告

### 管理 API

管理 API 用于编程管理:

- [设备 API](/reference/tailscale-api#tag/devices) - 设备管理
- [用户 API](/reference/tailscale-api#tag/users) - 用户管理
- [ACL API](/reference/tailscale-api#tag/acls) - ACL 管理
- [密钥 API](/reference/tailscale-api#tag/keys) - 密钥管理

### Terraform Provider

基础架构即代码:

```hcl
resource "tailscale_device" "server" {
  name = "server.example.ts.net"
  tags = ["tag:server"]
}
```

## 实用工具

### 网络检查

```bash
# 全面检查
tailscale netcheck

# 详细输出
tailscale netcheck -v

# JSON 输出
tailscale netcheck -json
```

### Ping 工具

```bash
# Ping 设备
tailscale ping example-device

# 详细 Ping
tailscale ping -c 4 example-device

# 指定 IP
tailscale ping 100.100.100.100
```

### Bug 报告

```bash
# 生成错误报告
tailscale bugreport

# 保存到文件
tailscale bugreport > bugreport.txt

# 复制到剪贴板
tailscale bugreport | pbcopy
```

## 扩展工具

### Tailscale CLI 扩展

使用 CLI 扩展:

```bash
# 自定义命令
alias ts-status='tailscale status | grep alice'
```

### 脚本工具

使用 Tailscale 脚本:

```bash
#!/bin/bash
# 简单状态检查
if tailscale status | grep -q "alice@example.com"; then
    echo "User is connected"
else
    echo "User is disconnected"
fi
```

## 最佳实践

### 1. 使用 CLI

- 使用 CLI 进行自动化
- 创建脚本进行常规任务
- 使用 JSON 输出进行解析

### 2. API 自动化

- 使用 API 进行批量操作
- 创建自动化工作流
- 集成 CI/CD

### 3. 监控

- 集成监控系统
- 设置告警
- 创建仪表板

### 4. 文档化

- 记录自定义工具
- 文档化脚本
- 创建示例

## 故障排除

### CLI 问题

检查步骤:

1. 确认 Tailscale 已安装
2. 验证客户端运行中
3. 检查网络连接
4. 查看日志

### API 问题

- 检查 API 密钥
- 验证权限
- 确认端点
- 查看错误响应

### 脚本问题

- 检查语法
- 验证输出格式
- 确认依赖
- 查看错误日志

## 扩展阅读

- [CLI 参考](/reference/cli) - 完整 CLI 参考
- [API 参考](/reference/api) - 完整 API 参考
- [Terraform Provider](/automations/terraform) - Terraform 文档

## 下一步

- [CLI 参考](/reference/cli) - 命令行工具
- [API 参考](/reference/api) - REST API
- [Terraform](/automations/terraform) - 自动化
