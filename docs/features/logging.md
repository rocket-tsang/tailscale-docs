# 日志概览

Tailscale 提供全面的日志系统,用于监控网络活动和故障排除。每个 Tailscale 客户端都会将日志流式传输到集中日志服务器。

## 什么是日志?

Tailscale 日志系统包括:

- 客户端操作日志
- 网络流量日志
- 配置审计日志
- SSH 会话日志
- Kubernetes Operator 日志

## 客户端日志

### 日志内容

每个客户端记录:

- 自身操作信息
- 尝试连接其他节点
- 连接事件(打开和关闭)
- 错误和警告信息

### 集中式日志管理

Tailscale 使用[定制的高容量分布式日志系统](https://apenwarr.ca/log/20190216)进行调试。客户端操作日志仅在本地可用,但可以将系统和容器日志流式传输到同一中央存储进行分析。

### 选择退出客户端日志

如果阻止客户端日志,Tailscale 可能无法提供技术支持。

```bash
# Windows
# 在 %ProgramData%\Tailscale\tailscaled-env.txt 中设置
TS_NO_LOGS_NO_SUPPORT=true

# Linux
export TS_NO_LOGS_NO_SUPPORT=true

# macOS
# 在 Tailscale 首选项中禁用
```

## Kubernetes Operator 日志

Operator 的协调日志会被集中收集用于调试。这些日志描述 Operator 为使部署状态与期望状态一致所采取的步骤。

### 选择退出 Kubernetes 日志

Helm 部署:

```yaml
operatorConfig:
  extraEnv:
  - name: TS_NO_LOGS_NO_SUPPORT
    value: "true"
```

静态清单部署:

```yaml
env:
- name: TS_NO_LOGS_NO_SUPPORT
  value: "true"
```

## 网络流量日志

网络流量日志可用于[高级版和企业版计划](/pricing)。

网络流量日志帮助您了解设备之间随时间的连接方式,即 tailnet 中流量的*流*。

流量日志严格不包含客户端操作或网络流量内容的信息。

### 启用网络流量日志

在管理控制台启用:

```
1. 进入 Logs 页面
2. 找到 Network Flow Logs
3. 点击 Enable
```

### 域名服务

流量日志可以配置为[流式传输](/features/logging/log-streaming)到 SIEM 系统。

## 服务器日志

### 配置审计日志

配置审计日志记录修改 tailnet 配置的操作:

- 操作类型
- 操作者
- 目标资源
- 时间戳

所有可以访问管理控制台的[用户](/reference/user-roles)都可以在管理控制台的 [Logs](https://login.tailscale.com/admin/logs) 页面检查配置审计日志。

审计日志默认为所有 tailnet 启用,最近 90 天内可用。

审计日志可以配置为[流式传输](/features/logging/log-streaming)到 SIEM 系统。

### SSH 会话日志

本地 SSH 会话日志在 1.48.0 版本中不再支持。

可以使用[Tailscale SSH 会话记录](/features/tailscale-ssh/tailscale-ssh-session-recording)从服务器设备流式传输记录。

## 日志管理

### 访问本地日志

#### Linux

```bash
# 系统日志
sudo journalctl -u tailscaled

# 查看最近的连接
sudo tailscale netcheck

# 调试模式
sudo tailscale up --debug
```

#### macOS

```bash
# 查看日志
log show --predicate 'process == "tailscaled"'

# 实时监控
log stream --predicate 'process == "tailscaled"'
```

#### Windows

```powershell
# 查看事件日志
Get-EventLog -LogName Application -Source Tailscale

# 查看 Tailscale 日志
Get-Content "C:\ProgramData\Tailscale\tailscaled.log"
```

### 查看网络流量日志

在管理控制台查看:

```
1. 登录管理控制台
2. 导航到 Logs 页面
3. 查看流量日志
4. 过滤和搜索
```

### 日志保留

- 客户端操作日志:本地存储
- 网络流量日志:根据计划和配置
- 审计日志:90 天
- SSH 会话日志:根据配置

## 最佳实践

### 1. 安全存储

- 保护日志访问
- 加密敏感日志
- 定期清理
- 备份重要日志

### 2. 集中管理

- 使用 SIEM 系统
- 配置日志聚合
- 设置告警规则
- 创建仪表板

### 3. 合规性

- 保留日志符合要求
- 加密敏感数据
- 访问控制
- 审计日志

### 4. 故障排除

- 实时监控日志
- 设置关键事件告警
- 分析日志模式
- 集中日志存储

## 故障排除

### 日志不显示

检查步骤:

1. 确认日志已启用
2. 检查网络连接
3. 验证配置
4. 查看其他设备

### 日志无法访问

可能原因:

- 权限不足
- 日志服务未运行
- 网络问题
- 配置错误

### SIEM 集成失败

- 检查 API 凭据
- 验证网络连通性
- 确认配置正确
- 查看集成日志

## 扩展阅读

- [网络流量日志](/features/logging/network-flow-logs) - 详细配置
- [审计日志](/features/logging/audit-logging) - 配置审计
- [日志流](/features/logging/log-streaming) - SIEM 集成
- [Tailscale 服务](/features/tailscale-services) - 服务日志

## 下一步

- [配置审计](/features/logging/audit-logging) - 审计配置
- [网络流量日志](/features/logging/network-flow-logs) - 流量监控
- [日志流](/features/logging/log-streaming) - SIEM 集成
