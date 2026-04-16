# 参考文档

这里是 Tailscale 的技术参考文档,包含 CLI、API、配置语法等内容。

## 内容概览

### 技术参考

- [CLI 参考](/reference/cli) - 命令行工具完整参考
- [API 参考](/reference/api) - RESTful API 文档
- [ACL 语法](/features/access-control) - ACL 配置语法

### 配置和设置

- [DNS 配置](/reference/dns) - DNS 配置选项
- [认证密钥](/reference/auth-keys) - 认证密钥使用
- [密钥过期](/reference/key-expiry) - 密钥管理

### 最佳实践

- [生产环境最佳实践](/reference/best-practices) - 生产部署指南
- [安全最佳实践](/reference/security) - 安全配置建议
- [高可用性](/reference/ha) - HA 配置

### 其他参考

- [术语表](/reference/glossary) - Tailscale 术语解释
- [FAQ](/reference/faq) - 常见问题解答
- [故障排除](/reference/troubleshooting) - 问题诊断指南

## 快速查找

### 常用命令

<Tabs>
<Tab title="连接管理">

```bash
# 连接到 tailnet
tailscale up

# 断开连接
tailscale down

# 查看状态
tailscale status
```

</Tab>
<Tab title="设备管理">

```bash
# 查看设备列表
tailscale status

# Ping 设备
tailscale ping device-name

# 查看 IP 地址
tailscale ip
```

</Tab>
<Tab title="网络配置">

```bash
# 设置子网路由器
tailscale up --advertise-routes=192.168.1.0/24

# 设置出口节点
tailscale up --advertise-exit-node

# 使用出口节点
tailscale up --exit-node=device-name
```

</Tab>
</Tabs>

### 常用 API

<Tabs>
<Tab title="设备管理">

```bash
# 列出设备
GET /api/v2/tailnet/example.com/devices

# 删除设备
DELETE /api/v2/tailnet/example.com/devices/device-id
```

</Tab>
<Tab title="ACL 管理">

```bash
# 获取 ACL
GET /api/v2/tailnet/example.com/acl

# 更新 ACL
POST /api/v2/tailnet/example.com/acl
```

</Tab>
<Tab title="认证密钥">

```bash
# 创建认证密钥
POST /api/v2/tailnet/example.com/keys

# 列出密钥
GET /api/v2/tailnet/example.com/keys
```

</Tab>
</Tabs>

## 文档版本

- VitePress 版本:最新
- Tailscale 文档来源:官方文档
- 翻译状态:部分翻译
- 最后更新:持续更新

## 下一步

- [CLI 参考](/reference/cli) - 学习命令行工具
- [API 参考](/reference/api) - 学习 API 使用
- [故障排除](/reference/troubleshooting) - 解决问题