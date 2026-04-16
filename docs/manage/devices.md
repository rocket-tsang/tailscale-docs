# 设备管理

了解如何在您的 tailnet 中管理设备,包括授权设备、分配标签、移除设备等操作。

## 设备状态

### Pending(待授权)

新注册的设备状态:

- 已安装 Tailscale
- 等待授权
- 无法访问资源
- 需要管理员批准

### Active(活跃)

已授权的设备:

- 可以访问资源
- 正常连接到 tailnet
- 显示在线状态
- 可以正常使用

### Inactive(不活跃)

已授权但离线的设备:

- 已授权但未连接
- 可能已关机或断网
- 保留在 tailnet 中
- 可以重新连接

### Expired(过期)

过期的设备:

- 密钥已过期
- 无法连接
- 需要重新认证
- 自动锁定

## 授权设备

### 方法一:管理控制台授权

1. 登录 [管理控制台](https://login.tailscale.com/admin/machines)
2. 找到"Pending"设备
3. 点击设备旁边的"Approve"
4. 确认授权

### 方法二:使用 ACL 自动授权

配置 ACL 自动授权特定设备:

```json
{
  "autoApprovers": {
    "tag:server": ["group:admins"]
  }
}
```

### 方法三:认证密钥

使用认证密钥自动授权:

```bash
tailscale up --authkey=tskey-key
```

设备会自动获得授权并分配标签。

## 设备信息

### 查看设备详情

在管理控制台查看:

- 设备名称
- Tailscale IP 地址
- 操作系统
- 用户
- 标签
- 连接状态
- 创建时间
- 最后活动时间

### 使用 CLI 查看

```bash
tailscale status
```

输出示例:

```
100.100.100.100  laptop-alice  alice@example.com  macOS  -
100.101.102.103 server-bob     bob@example.com    linux  -
```

### 查看详细状态

```bash
tailscale status --verbose
```

## 设备标签

### 分配标签

标签用于组织设备和控制访问。

#### 在管理控制台分配

1. 登录管理控制台
2. 找到设备
3. 点击"Tags"
4. 选择或创建标签
5. 保存更改

#### 使用认证密钥分配

创建带有标签的认证密钥:

```bash
# 在管理控制台创建认证密钥时指定标签
# 或使用 API
```

使用认证密钥注册:

```bash
tailscale up --authkey=tskey-key --advertise-tags=tag:server
```

#### 定义标签所有者

在 ACL 中定义谁可以分配标签:

```json
{
  "tagOwners": {
    "tag:server": ["group:admins"],
    "tag:dev": ["group:developers"]
  }
}
```

### 标签命名规范

建议的标签命名:

- `tag:production` - 生产环境设备
- `tag:staging` - 测试环境设备
- `tag:development` - 开发环境设备
- `tag:web` - Web 服务器
- `tag:db` - 数据库服务器
- `tag:client` - 客户端设备

### 在 ACL 中使用标签

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["tag:web"],
      "dst": ["tag:db:3306"]
    }
  ]
}
```

## 移除设备

### 方法一:管理控制台移除

1. 登录管理控制台
2. 找到设备
3. 点击"..."菜单
4. 选择"Remove"
5. 确认操作

### 方法二:用户自主删除

设备用户可以删除自己的设备:

```bash
tailscale logout
```

或在管理控制台删除自己的设备。

### 方法三:API 删除

```bash
curl -X DELETE \
  https://api.tailscale.com/api/v2/tailnet/example.com/devices/device-id \
  -H "Authorization: Bearer tskey-api-key"
```

## 设备配置

### 密钥过期

设备密钥会定期过期:

- Personal Pro: 默认 180 天
- Enterprise: 可配置
- 自动提醒用户重新认证

配置密钥过期时间:

在管理控制台:

1. 点击"Settings"
2. 选择"Key expiry"
3. 设置过期天数
4. 保存配置

### Ephemeral nodes(临时节点)

临时节点在注销后自动删除:

```bash
tailscale up --ephemeral
```

用途:

- CI/CD runners
- 测试环境
- 临时访问
- 自动清理

### 重命名设备

在管理控制台重命名:

1. 找到设备
2. 点击"Name"
3. 输入新名称
4. 保存更改

或使用 CLI:

```bash
tailscale set --hostname=new-name
```

## 设备访问控制

### ACL 规则

使用 ACL 控制设备访问:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["alice@example.com"],
      "dst": ["bob@example.com:22"]
    }
  ]
}
```

### 标签访问控制

基于标签的访问控制:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["tag:web"],
      "dst": ["tag:db:3306"]
    }
  ]
}
```

### 拒绝特定设备

```json
{
  "acls": [
    {
      "action": "reject",
      "src": ["device-name"],
      "dst": ["tag:production:*"]
    }
  ]
}
```

## 设备监控

### 连接状态

检查设备连接:

```bash
tailscale status
```

### Ping 设备

测试连接:

```bash
tailscale ping device-name
```

### 设备日志

查看设备日志:

```bash
# Linux
journalctl -u tailscaled -f

# macOS
log show --predicate 'process == "tailscaled"' --last 1h

# Windows
Get-Content "C:\ProgramData\Tailscale\Logs\tailscaled.log" -Tail 100
```

## 高级功能

### Tailnet Lock

防止未授权节点加入:

- 验证节点签名
- 阻止未授权连接
- 高级安全保护

配置 Tailnet Lock:

在管理控制台启用。

### Device posture

检查设备状态:

- 操作系统版本
- 安全更新
- 防火墙状态
- 符合性检查

### SSH 访问

配置 Tailscale SSH:

```bash
tailscale up --ssh
```

通过 ACL 控制 SSH 访问。

## 最佳实践

### 1. 标签管理

使用标签组织设备:

- 按环境分类(prod, staging, dev)
- 按功能分类(web, db, cache)
- 按团队分类

### 2. 定期审查

定期检查:

- 设备列表
- 授权状态
- 标签分配
- 活跃状态
- 过期设备

### 3. 自动化

使用认证密钥:

- 自动授权
- 自动标签分配
- 自动命名
- CI/CD 集成

### 4. 安全配置

- 启用 Tailnet Lock
- 配置密钥过期
- 定期移除不活跃设备
- 审查访问权限

### 5. 文档化

记录:

- 设备命名规范
- 标签使用规范
- 授权流程
- 移除流程

## 故障排除

### 设备无法连接

检查:

- 设备是否已授权
- 密钥是否过期
- ACL 是否允许
- 网络连接状态

### 标签不生效

检查:

- 标签是否已分配
- ACL 是否正确
- tagOwners 配置
- 认证密钥设置

### 设备状态异常

检查:

- Tailscale 服务状态
- 网络配置
- 防火墙设置
- 系统日志

## 下一步

- [访问控制](/features/access-control) - 配置 ACL
- [用户管理](/manage/users) - 管理用户
- [子网路由器](/features/subnet-routers) - 配置路由器