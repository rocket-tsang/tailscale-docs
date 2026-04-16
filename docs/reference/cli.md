# CLI 参考

Tailscale 命令行工具(CLI)提供了丰富的功能来管理您的 tailnet。

## 安装和基本使用

### 安装

Tailscale CLI 随 Tailscale 客户端一起安装,无需单独安装。

### 基本命令

```bash
tailscale [command] [options]
```

查看帮助:

```bash
tailscale help
tailscale [command] --help
```

## 连接管理

### tailscale up

连接到 tailnet。

```bash
tailscale up [options]
```

常用选项:

- `--authkey=KEY` - 使用认证密钥
- `--advertise-routes=SUBNET` - 广播子网
- `--advertise-exit-node` - 广播为出口节点
- `--exit-node=DEVICE` - 使用出口节点
- `--exit-node-allow-lan-access` - 允许 LAN 访问
- `--ssh` - 启用 Tailscale SSH
- `--hostname=NAME` - 设置主机名
- `--advertise-tags=TAGS` - 设置标签
- `--authkey=tskey-key` - 使用认证密钥

示例:

```bash
# 基本连接
tailscale up

# 使用认证密钥
tailscale up --authkey=tskey-auth-key

# 设置为出口节点
tailscale up --advertise-exit-node

# 使用出口节点
tailscale up --exit-node=device-name

# 广播子网
tailscale up --advertise-routes=192.168.1.0/24
```

### tailscale down

断开连接。

```bash
tailscale down
```

### tailscale logout

注销并删除设备。

```bash
tailscale logout
```

## 状态和信息

### tailscale status

查看 tailnet 状态。

```bash
tailscale status [options]
```

选项:

- `--verbose` - 详细输出
- `--json` - JSON 格式输出
- `--self` - 仅显示本设备

示例:

```bash
# 基本状态
tailscale status

# 详细状态
tailscale status --verbose

# JSON 格式
tailscale status --json
```

### tailscale ip

查看 Tailscale IP 地址。

```bash
tailscale ip [options]
```

选项:

- `-4` - IPv4 地址
- `-6` - IPv6 地址
- `--json` - JSON 格式

示例:

```bash
# 显示所有 IP
tailscale ip

# 仅 IPv4
tailscale ip -4

# 仅 IPv6
tailscale ip -6
```

### tailscale whois

查看用户或设备信息。

```bash
tailscale whois [IP_OR_NAME]
```

示例:

```bash
tailscale whois 100.100.100.100
tailscale whois device-name
```

### tailscale version

查看版本信息。

```bash
tailscale version
```

## 网络操作

### tailscale ping

Ping 其他设备。

```bash
tailscale ping [DEVICE_OR_IP] [options]
```

选项:

- `--c=COUNT` - Ping 次数
- `--timeout=SECONDS` - 超时时间
- `--verbose` - 详细输出

示例:

```bash
# Ping 设备
tailscale ping device-name

# Ping IP
tailscale ping 100.100.100.100

# 指定次数
tailscale ping --c=5 device-name
```

### tailscale nc

网络连接工具。

```bash
tailscale nc [HOST] [PORT]
```

示例:

```bash
tailscale nc device-name 22
```

### tailscale ssh

通过 Tailscale SSH 连接。

```bash
tailscale ssh [USER@DEVICE] [options]
```

示例:

```bash
# SSH 连接
tailscale ssh user@device-name

# 指定端口
tailscale ssh -p 22 user@device-name
```

## 配置和管理

### tailscale set

设置配置选项。

```bash
tailscale set [options]
```

选项:

- `--hostname=NAME` - 设置主机名
- `--advertise-routes=SUBNET` - 设置子网路由
- `--advertise-exit-node` - 设置为出口节点
- `--exit-node=DEVICE` - 设置出口节点

示例:

```bash
# 设置主机名
tailscale set --hostname=my-device

# 更新子网路由
tailscale set --advertise-routes=192.168.1.0/24
```

### tailscale routes

管理子网路由。

```bash
tailscale routes [options]
```

选项:

- `--accept-routes` - 接受路由
- `--reject-routes` - 拒绝路由
- `--list` - 列出路由

示例:

```bash
# 接受路由
tailscale routes --accept-routes

# 查看路由列表
tailscale routes --list
```

### tailscale dns

DNS 配置。

```bash
tailscale dns [options]
```

示例:

```bash
# 查看 DNS 状态
tailscale dns status

# 配置 DNS
tailscale dns set
```

## 认证和密钥

### tailscale auth

认证管理。

```bash
tailscale auth [command]
```

子命令:

- `login` - 登录
- `logout` - 注销
- `status` - 认证状态
- `list` - 列出账户

示例:

```bash
# 登录
tailscale auth login

# 列出账户
tailscale auth list

# 切换账户
tailscale switch
```

### tailscale keys

密钥管理(企业功能)。

```bash
tailscale keys [command]
```

示例:

```bash
# 创建密钥
tailscale keys create

# 列出密钥
tailscale keys list
```

## ACL 和策略

### tailscale acl

ACL 管理。

```bash
tailscale acl [command] [options]
```

子命令:

- `check` - 检查 ACL
- `get` - 获取 ACL
- `set` - 设置 ACL

示例:

```bash
# 检查 ACL
tailscale acl check --src alice@example.com --dst tag:server:22

# 获取 ACL
tailscale acl get

# 设置 ACL
tailscale acl set policy.json
```

## 服务和共享

### tailscale serve

本地服务共享。

```bash
tailscale serve [options] [PORT_OR_PATH]
```

示例:

```bash
# 共享 HTTP 服务
tailscale serve 8080

# 共享静态文件
tailscale serve /path/to/files

# 启用 HTTPS
tailscale serve --https 8080
```

### tailscale funnel

公网暴露服务。

```bash
tailscale funnel [options] [PORT]
```

示例:

```bash
# 暴露服务
tailscale funnel 8080

# 停止暴露
tailscale funnel --stop 8080
```

### tailscale file

文件传输(Taildrop)。

```bash
tailscale file [command]
```

子命令:

- `cp` - 复制文件
- `get` - 获取文件
- `list` - 列出文件

示例:

```bash
# 发送文件
tailscale file cp file.txt device-name:

# 接收文件
tailscale file get

# 列出待接收文件
tailscale file list
```

## 调试和诊断

### tailscale debug

调试工具。

```bash
tailscale debug [command]
```

子命令:

- `derp-map` - DERP 映射
- `peer-change` - 节点变化
- `ts2021` - 测试连接

示例:

```bash
# 查看 DERP 映射
tailscale debug derp-map

# 查看节点变化
tailscale debug peer-change
```

### tailscale bugreport

生成 bug 报告。

```bash
tailscale bugreport [options]
```

选项:

- `--note=TEXT` - 添加说明
- `--record` - 记录问题

示例:

```bash
# 生成报告
tailscale bugreport

# 添加说明
tailscale bugreport --note="Connection issue"
```

### tailscale logs

查看日志。

```bash
tailscale logs [options]
```

示例:

```bash
# 查看日志
tailscale logs
```

## 其他命令

### tailscale update

更新 Tailscale。

```bash
tailscale update [options]
```

选项:

- `--version=VERSION` - 指定版本
- `--force` - 强制更新

示例:

```bash
# 更新到最新版本
tailscale update

# 更新到指定版本
tailscale update --version=1.40.0
```

### tailscale certs

证书管理。

```bash
tailscale certs [DOMAIN]
```

示例:

```bash
# 获取证书
tailscale certs device-name.ts.net
```

### tailscale lock

Tailnet Lock 管理。

```bash
tailscale lock [command]
```

子命令:

- `status` - 查看状态
- `sign` - 签名节点
- `disable` - 禁用锁定

示例:

```bash
# 查看状态
tailscale lock status

# 签名节点
tailscale lock sign
```

## 命令总结

| 命令 | 说明 |
|------|------|
| `up` | 连接 |
| `down` | 断开 |
| `status` | 状态 |
| `ip` | IP 地址 |
| `ping` | Ping |
| `ssh` | SSH |
| `serve` | 服务共享 |
| `funnel` | 公网暴露 |
| `file` | 文件传输 |
| `acl` | ACL 管理 |
| `auth` | 认证管理 |
| `debug` | 调试工具 |
| `bugreport` | Bug 报告 |
| `version` | 版本信息 |

## 下一步

- [API 参考](/reference/api) - RESTful API
- [访问控制](/features/access-control) - ACL 配置
- [故障排除](/reference/troubleshooting) - 问题解决