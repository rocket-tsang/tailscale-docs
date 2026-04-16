# 临时节点

临时节点使连接和清理短期设备(如容器、云函数或 CI/CD 系统)变得更加容易。这些设备定期启动和关闭。

## 什么是临时节点?

临时节点与常规节点的区别:

- 活动时间较短后自动从网络中移除
- 下次创建时有新的 IP 地址
- 运行 `tailscale logout` 后立即移除
- 只能使用[临时认证密钥](/features/access-control/auth-keys)创建

默认情况下,当添加新设备时,它会出现在管理控制台和客户端应用中。但短期设备可能使网络难以检查,因为设备在被删除前会一直存在。

临时节点自动在不活动后短时间内从网络中移除。每个临时节点都有一个新的 IP 地址。

## 使用场景

### 容器部署

```bash
# Docker 容器
docker run -d \
  --name myapp \
  -e Tailscale_auth_key=tskey-key \
  myapp:latest
```

### 云函数

```python
# Google Cloud Functions
import tailscale

def main(event):
    # 启动临时节点
    tailscale.up(auth_key=event['auth_key'])
```

### CI/CD

```yaml
# GitHub Actions
jobs:
  test:
    steps:
      - name: Setup Tailscale
        run: tailscale up --auth-key=$ACTIONS_TAILSCALE_KEY
```

### ephemeral 实例

```bash
# AWS EC2 实例
#!/bin/bash
tailscale up --auth-key=$EC2_AUTH_KEY
# ... 应用运行 ...
tailscale logout
```

## 创建临时节点

### 1. 生成临时认证密钥

在管理控制台的[Keys](https://login.tailscale.com/admin/settings/keys)页面生成临时认证密钥。

### 2. 配置基础设施

使用临时密钥更新脚本:

```bash
# Bash 脚本
sudo tailscale up --auth-key=<your ephemeral key>

# Dockerfile
RUN curl -fsSL https://tailscale.com/install.sh | sh
CMD tailscale up --auth-key=${TAILSCALE_AUTH_KEY}

# Kubernetes
env:
- name: TAILSCALE_AUTH_KEY
  value: "tskey-ephemeral-key"
```

### 3. 触发构建

基础设施启动新设备时,它会显示为管理控制台中的临时节点。

## 临时节点特性

### 自动移除

临时节点在正常情况下从不活动后 30 到 60 分钟自动移除。

### 立即移除

运行 [`tailscale logout`](/reference/tailscale-cli#logout) 立即移除:

```bash
sudo tailscale logout
```

### 新的 IP 地址

每次创建临时节点时,都会获得新的 Tailscale IP 地址。

## 临时认证密钥

### 可重用 vs 一次性

- **一次性**:只能使用一次
- **可重用**:可以多次使用

临时密钥可以是任一种类型。

### 密钥过期

临时密钥会在指定的天数后自动过期(1-90 天)。

如果未指定过期时间,密钥会在最大 90 天后过期。

### 临时密钥标记设备

临时密钥可以标记设备。访问控制策略基于标记应用。

## 安全考虑

### 1. 保护密钥

- 使用密钥保管
- 限制密钥访问
- 定期轮换
- 监控使用情况

### 2. 限制访问

- 使用最小权限
- 限制网络访问
- 监控活动

### 3. 监控

- 查看活动日志
- 检查连接
- 审计使用情况

## 故障排除

### 临时节点未创建

检查步骤:

1. 确认临时密钥已生成
2. 验证密钥未过期
3. 检查网络连接
4. 查看错误消息

### 临时节点未移除

可能原因:

- 仍在活动
- 网络连接
- 服务仍在运行

### 密钥问题

- 检查密钥格式
- 验证密钥未过期
- 确认密钥权限
- 查看错误日志

## 最佳实践

### 1. 使用临时密钥

- 对于短期工作负载
- 自动清理
- 减少管理开销

### 2. 监控使用

- 跟踪使用时间
- 检查配额
- 查看日志

### 3. 文档化

- 记录设置
- 文档化步骤
- 创建检查清单

### 4. 自动化清理

```bash
# 在脚本末尾
tailscale logout
```

## 工作原理

### 创建流程

```
生成临时密钥
    ↓
配置基础设施
    ↓
启动设备
    ↓
设备加入 tailnet
    ↓
标记为临时
    ↓
自动清理超时
```

### 移除流程

```bash
# 方法 1: 自动
超时后自动移除

# 方法 2: 手动
tailscale logout

# 方法 3: 减速
运行 tailscaled 时使用 --state=mem: 标志
```

## 扩展阅读

- [认证密钥](/features/access-control/auth-keys) - 认证密钥
- [标签](/features/tags) - 标签系统
- [密钥过期](/features/access-control/key-expiry) - 密钥管理

## 下一步

- [认证密钥](/features/access-control/auth-keys) - 密钥管理
- [标签](/features/tags) - 标签系统
- [访问控制](/features/access-control) - ACL 管理
