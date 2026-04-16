# 标签系统

标签用于对 Tailscale tailnet 中的设备进行身份验证和标识。它们类似于服务账户,但具有更多灵活性。

## 什么是标签?

标签是 Tailscale 提供的设备标识系统:

- 为非用户设备提供身份
- 基于*目的*管理访问控制策略
- 支持多个标签 per 设备
- 灵活的标签所有权

### 标签特点

- 适用于服务器和设备
- 可以分配多个标签
- 在 tailnet 策略文件中定义
- 只有指定的标签所有者可以分配标签

### 使用场景

```bash
# 示例:一个设备有多个角色
tag:postgresql     # 数据库服务器
tag:prod           # 生产环境
tag:web-server     # Web 服务器
```

## 先决条件

标签是免费功能,适用于所有计划。但需要特定权限:

- 需要是 tailnet 的[所有者、管理员或网络管理员](/reference/user-roles)才能在 tailnet 策略文件中定义标签
- 需要是标签所有者才能将标签分配给设备

## 限制

- 不能从设备移除所有标签
- 不能使用 --advertise-tags 标志移除标签
- IP sets 不支持标签
- 标签设备只能 SSH 到其他标签设备
- 一些限制围绕使用标签定义组或作为 SSH 源存在

## 使用场景

### 服务设备管理

标签非常适合管理不希望链接到特定用户的服务设备:

- Web 应用服务器
- 数据库服务器
- CI/CD 运行器
- IoT 设备

### 多用户管理

标签允许多个用户管理设备:

```json
{
  "tagOwners": {
    "tag:database": ["group:dba", "alice@example.com"]
  }
}
```

## 最佳实践

### 1. 清晰的命名规范

```
推荐命名:
- tag:prod-postgresql       # 生产 PostgreSQL 服务器
- tag:nonprod-db            # 非生产数据库
- tag:prod-emea-web         # EMEA 生产 Web 服务器
- tag:ci-cd-runner          # CI/CD 运行器

避免:
- tag:foo-bar               # 无法识别用途
- tag:temp                  # 模糊不清
```

### 2. 使用认证密钥

使用带有预分配标签的[认证密钥](/features/access-control/auth-keys):

```bash
tailscale up \
  --auth-key=tskey-key \
  --advertise-tags=tag:prod,tag:web
```

### 3. 避免用于用户设备

标签仅用于非人类机器。用户只能通过指定的用户账户访问 Tailscale。

不要用于:

- MacBook 或 Android 等用户设备
- 联系个人用户
- 终端用户设备身份验证

### 4. 谨慎考虑所有者

在 `tagOwners` 部分仔细考虑每个标签的所有者。

## 工作原理

### 定义标签

在 tailnet 策略文件的 `tagOwners` 部分定义标签:

```json
{
  "tagOwners": {
    "tag:server": ["dave@example.com"]
  }
}
```

### 标签所有权

标签可以有空的所有者列表。所有标签都隐式由 tailnet 的[所有者、管理员和网络管理员](/reference/user-roles)拥有。

### 应用标签

可以使用管理控制台、Tailscale CLI 或 Tailscale API 应用标签:

#### 管理控制台

```
1. 在管理控制台的 Machines 页面
2. 找到设备
3. 点击"..."菜单
4. 选择"Edit tags"
5. 添加所需标签
6. 点击"Save"
```

#### CLI

```bash
# 添加单个标签
sudo tailscale login --advertise-tags=tag:server

# 添加多个标签
sudo tailscale login \
  --advertise-tags=tag:server,tag:development

# 移除所有标签
sudo tailscale login --advertise-tags=
```

#### API

```bash
curl https://api.tailscale.com/api/v2/device/12345/tags \
  -u "tskey-<key>" \
  -H "Content-Type: application/json" \
  --data-binary '{"tags": ["tag:prod", "tag:web"]}'
```

## 高级标签层次结构

标签所有者非常灵活。可以分配多个所有者,可以是用户、组或甚至其他标签。

```json
{
  "tagOwners": {
    "tag:deployment-1": ["alice@tailscale.com"],
    "tag:prod-2": ["tag:deployment-1"],
    "tag:test-2": ["tag:deployment-1"]
  }
}
```

## 使用示例

### 示例 1: Web 应用服务器

```json
{
  "tagOwners": {
    "tag:web": ["group:devops"]
  },
  "groups": {
    "group:devops": ["ops@example.com"]
  },
  "acls": [
    {
      "action": "accept",
      "src": ["tag:web"],
      "dst": ["tag:db:3306,80,443"]
    }
  ]
}
```

### 示例 2: 数据库服务器

```json
{
  "tagOwners": {
    "tag:database": ["group:dba"]
  },
  "groups": {
    "group:dba": ["dba@example.com"]
  },
  "acls": [
    {
      "action": "accept",
      "src": ["tag:application"],
      "dst": ["tag:database:5432"]
    }
  ]
}
```

### 示例 3: CI/CD 运行器

```json
{
  "tagOwners": {
    "tag:ci-cd": ["group:engineering"]
  },
  "groups": {
    "group:engineering": ["dev@example.com"]
  },
  "acls": [
    {
      "action": "accept",
      "src": ["tag:ci-cd"],
      "dst": ["tag:ci-cd:*"]
    }
  ]
}
```

## 标签与用户身份验证

标签与用户身份验证并行。它们为基于服务的设备(如 Web 服务器或应用连接器)提供与用户账号相同的角色。

重要:设备无法同时具有用户账号和标签。应用标签会移除用户账号。同样,用户账号会移除所有标签。

## 密钥过期

标记设备的密钥过期默认禁用:

- 第一次应用标签并验证时
- 重新验证 2022 年 3 月 10 日前标记的设备

如需更改,可以从管理控制台或使用 Tailscale API 启用或禁用密钥过期。

## 在 Tailscale 生态系统中

标签与几乎所有其他 Tailscale 功能无缝工作:

### 出口节点

虽然端用户设备可以作为出口节点,但更常见的是使用基于标签的身份。

### 子网路由器

虽然端用户设备可以作为子网路由器,但更常见的是使用基于标签的身份。

### 应用连接器

应用连接器设备严格是基于服务的,必须使用基于标签的身份验证。

### 访问控制

使用标签在 tailnet 中选择和服务设备创建访问控制策略:

#### ACL

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["tag:prod"],
      "dst": ["tag:prod:*"]
    }
  ]
}
```

#### 授权

```json
{
  "grants": [
    {
      "src": ["tag:prod"],
      "dst": ["tag:tailsql"],
      "ip": ["*"]
    }
  ]
}
```

### 自动组

`autogroup:tagged` 自动组选择所有具有基于标签身份的设备。

## 最佳实践

### 1. 定义清晰的命名约定

```
推荐模式:

Server Role:
- tag:app-server
- tag:database
- tag:queue

Application Name:
- tag:support-console
- tag:finance-reporting
- tag:operations-dashboard

Environment:
- tag:prod
- tag:staging
- tag:dev

Location:
- tag:americas
- tag:emea
- tag:south-asia
```

### 2. 使用复合标签

由于标签不会为访问规则"连接",使用复合标签:

```
tag:prod-app           # 生产应用服务器
tag:nonprod-db         # 非生产数据库服务器
tag:prod-app-finance   # 生产财务报告应用
```

### 3. 文档化标签使用

维护清晰的文档记录如何在 tailnet 中使用和管理标签。

### 4. 使用测试

使用[测试](/reference/syntax/policy-file#tests)验证 tailnet 策略文件:

```json
{
  "tests": [
    {
      "src": "group:sre",
      "accept": ["tag:prod:1234"]
    }
  ]
}
```

## 故障排除

### 无法分配标签

检查步骤:

1. 确认标签已定义
2. 检查标签所有者
3. 验证权限
4. 查看错误消息

### 标签不生效

可能原因:

- ACL 规则不正确
- 标签未正确分配
- 设备未重新验证
- 策略文件语法错误

### 权限问题

- 确认是标签所有者
- 检查用户角色
- 验证 ACL 规则
- 查看审计日志

## 扩展阅读

- [访问控制](/features/access-control) - 了解 ACL
- [认证密钥](/features/access-control/auth-keys) - 使用认证密钥
- [密钥过期](/features/access-control/key-expiry) - 密钥管理

## 下一步

- [访问控制](/features/access-control) - 配置 ACL
- [用户管理](/manage/users) - 管理用户权限
- [设备管理](/manage/devices) - 管理设备标签
