# Tailscale SSH

Tailscale SSH 允许您通过 tailnet 安全地 SSH 连接到设备，无需管理 SSH 密钥，身份验证由 Tailscale 的身份系统接管。

## 什么是 Tailscale SSH？

传统 SSH 需要：
- 手动分发和管理公钥
- 维护 `authorized_keys` 文件
- 管理证书或跳板机

Tailscale SSH 的优势：
- **无需 SSH 密钥** —— 使用 Tailscale 身份验证
- **基于身份的访问** —— 通过 ACL 精确控制谁能访问哪台机器
- **会话录制** —— 可选地录制 SSH 会话用于审计
- **自动证书** —— 支持 HTTPS 证书，无需额外配置

## 启用 Tailscale SSH

### 第一步：在目标设备上启用

```bash
sudo tailscale up --ssh
```

或修改 `/etc/tailscale/tailscaled.conf` 以永久启用：

```bash
sudo tailscale set --ssh
```

验证是否启用：

```bash
tailscale status
```

输出中应包含：

```
...
SSH: enabled
```

### 第二步：配置 ACL

在管理控制台的 ACL 中添加 SSH 规则：

```json
{
  "ssh": [
    {
      "action": "accept",
      "src": ["autogroup:member"],
      "dst": ["autogroup:self"],
      "users": ["autogroup:nonroot", "root"]
    }
  ]
}
```

#### 常用 SSH ACL 规则示例

**允许管理员访问所有设备：**

```json
{
  "ssh": [
    {
      "action": "accept",
      "src": ["group:admins"],
      "dst": ["*"],
      "users": ["autogroup:nonroot"]
    }
  ]
}
```

**允许用户访问自己的设备：**

```json
{
  "ssh": [
    {
      "action": "accept",
      "src": ["autogroup:member"],
      "dst": ["autogroup:self"],
      "users": ["autogroup:nonroot"]
    }
  ]
}
```

**要求重新认证（check 模式）：**

```json
{
  "ssh": [
    {
      "action": "check",
      "src": ["autogroup:member"],
      "dst": ["tag:production"],
      "users": ["root"],
      "checkPeriod": "20h"
    }
  ]
}
```

`action: "check"` 表示连接时会要求用户重新进行身份验证。

## 连接到设备

使用标准 `ssh` 命令，以 Tailscale 主机名连接：

```bash
ssh user@device-name
```

或使用 Tailscale IP：

```bash
ssh user@100.x.x.x
```

::: tip 提示
如果目标设备启用了 MagicDNS，也可以使用完整域名：`ssh user@device-name.tailnet-name.ts.net`
:::

无需指定密钥文件，Tailscale 会自动处理身份验证。

## 用户映射

Tailscale SSH 会将 Tailscale 用户映射到系统用户：

| `users` 值 | 说明 |
|-----------|------|
| `autogroup:nonroot` | 与 Tailscale 账号邮箱前缀同名的非 root 用户 |
| `autogroup:self` | 设备所有者对应的系统用户 |
| `root` | root 用户 |
| `alice` | 指定系统用户名 |

## 会话录制

::: warning 注意
会话录制功能需要 Tailscale 企业版。
:::

在 ACL 中启用录制：

```json
{
  "ssh": [
    {
      "action": "accept",
      "src": ["group:admins"],
      "dst": ["tag:production"],
      "users": ["root"],
      "recorder": ["tag:recorder"],
      "enforceRecorder": true
    }
  ]
}
```

`enforceRecorder: true` 表示若录制不可用则拒绝连接。

## 与传统 SSH 共存

Tailscale SSH 与系统原有的 SSH 服务（`sshd`）互不干扰，可同时运行：

- 系统 `sshd` 监听 22 端口，使用密钥认证
- Tailscale SSH 只在 tailnet 内可用，使用 Tailscale 身份认证

如需禁用系统 SSH 并完全依赖 Tailscale SSH：

```bash
sudo systemctl disable --now sshd
```

::: warning 注意
禁用 sshd 前，确保 Tailscale SSH 已正常工作，否则可能失去访问途径。
:::

## 故障排除

### 连接被拒绝

检查 ACL 是否已配置 SSH 规则，以及目标设备是否启用了 Tailscale SSH：

```bash
tailscale ssh --check user@device-name
```

### 用户不存在

Tailscale SSH 需要目标系统中存在对应的系统用户，需手动创建：

```bash
sudo useradd -m alice
```

### 查看 SSH 连接日志

```bash
sudo journalctl -u tailscaled | grep ssh
```

## 下一步

- [访问控制](/features/access-control) - 深入配置 SSH ACL
- [标签](/features/tags) - 使用标签管理设备访问权限
- [日志](/features/logging) - 审计 SSH 访问记录
