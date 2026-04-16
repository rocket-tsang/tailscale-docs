# 功能概览

Tailscale 提供丰富的功能来满足各种网络连接需求。

## 核心功能

### 🔐 访问控制

基于 ACL 的细粒度访问控制,确保安全。

- [访问控制列表](/features/access-control) - 配置访问策略
- [用户管理](/manage/users) - 管理用户权限
- [设备管理](/manage/devices) - 管理设备授权

### 🌐 网络扩展

扩展您的网络覆盖范围。

- [子网路由器](/features/subnet-routers) - 访问本地网络资源
- [出口节点](/features/exit-nodes) - 路由所有流量
- [MagicDNS](/features/magicdns) - 自动 DNS 解析

### 🔧 集成工具

与现有工具和平台集成。

- [Tailscale SSH](/features/tailscale-ssh) - 安全 SSH 访问
- [Kubernetes Operator](/features/kubernetes-operator) - Kubernetes 集成
- [Docker](/features/docker) - 容器集成

### 📊 监控和日志

跟踪和分析网络活动。

- [网络流量日志](/features/logging/network-flow-logs) - 连接日志
- [审计日志](/features/logging/audit-logging) - 管理操作日志
- [Webhooks](/features/webhooks) - 自动通知

## 高级功能

### 🚀 服务共享

共享您的服务给他人。

- [Tailscale Serve](/features/tailscale-serve) - 快速共享 HTTP 服务
- [Tailscale Funnel](/features/tailscale-funnel) - 暴露服务到公网
- [Taildrop](/features/taildrop) - 设备间文件传输

### 🔒 安全增强

额外的安全保护措施。

- [Tailnet Lock](/features/tailnet-lock) - 阻止未授权节点
- [HTTPS 证书](/features/https-certificates) - 自动 HTTPS
- [密钥管理](/features/key-management) - 管理认证密钥

### 🤖 自动化

自动化您的网络管理。

- [Terraform Provider](/automations/terraform) - 基础设施即代码
- [API](/reference/api) - RESTful API
- [CLI](/reference/cli) - 命令行工具

## 功能列表

| 功能 | 说明 | 状态 |
|------|------|------|
| 访问控制 | ACL 和权限管理 | ✅ |
| 子网路由器 | 广播本地网络 | ✅ |
| 出口节点 | 全流量路由 | ✅ |
| MagicDNS | 自动 DNS | ✅ |
| Tailscale SSH | SSH 访问 | ✅ |
| Kubernetes Operator | K8s 集成 | ✅ |
| Docker | 容器支持 | ✅ |
| 网络日志 | 流量日志 | ✅ |
| 审计日志 | 操作日志 | ✅ |
| Webhooks | 事件通知 | ✅ |
| Tailscale Serve | HTTP 服务 | ✅ |
| Tailscale Funnel | 公网暴露 | ✅ |
| Taildrop | 文件传输 | ✅ |
| Tailnet Lock | 安全锁定 | ✅ |
| HTTPS 证书 | 自动证书 | ✅ |
| Terraform | 自动化 | ✅ |
| API | REST API | ✅ |
| CLI | 命令行 | ✅ |

## 功能对比

### 免费计划

- 最多 100 个设备
- 基础访问控制
- 子网路由器
- 出口节点
- MagicDNS

### Personal Pro

- 无限设备
- 高级 ACL
- 网络日志
- 审计日志
- 自定义域名

### Business/Enterprise

- SSO 集成
- Tailnet Lock
- API 访问
- Terraform Provider
- Webhooks
- 多 tailnet 管理
- 自定义支持

## 选择适合的功能

### 个人用户

推荐功能:

- 快速入门
- MagicDNS
- 子网路由器
- Taildrop

### 小团队

推荐功能:

- 访问控制
- 用户管理
- 网络日志
- Tailscale SSH

### 企业

推荐功能:

- SSO 集成
- Tailnet Lock
- 审计日志
- API 和 Terraform
- Webhooks

## 下一步

- [访问控制](/features/access-control) - 配置安全策略
- [子网路由器](/features/subnet-routers) - 扩展网络
- [出口节点](/features/exit-nodes) - 路由流量