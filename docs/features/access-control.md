# 访问控制列表(ACL)

Tailscale 的访问控制列表(ACL)允许您细粒度地控制 tailnet 中设备之间的通信权限。

## ACL 概述

ACL 提供以下功能:

- 定义哪些设备可以访问哪些服务
- 基于用户、标签或 IP 地址的规则
- 支持复杂的访问策略
- JSON 格式的配置文件

## ACL 文件结构

ACL 配置文件是一个 JSON 文件,包含以下主要部分:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["group:developers"],
      "dst": ["tag:server:*"]
    }
  ],
  "tagOwners": {
    "tag:server": ["group:admins"]
  },
  "groups": {
    "group:admins": ["alice@example.com", "bob@example.com"],
    "group:developers": ["dev@example.com"]
  }
}
```

## 主要组成部分

### ACLs

`acls` 数组定义访问规则:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["源"],
      "dst": ["目标:端口"]
    }
  ]
}
```

参数说明:

- `action`: `accept` 或 `reject`
- `src`: 源地址(用户、标签或 IP)
- `dst`: 目标地址和端口

### TagOwners

`tagOwners` 定义谁可以分配标签:

```json
{
  "tagOwners": {
    "tag:server": ["group:admins", "alice@example.com"]
  }
}
```

### Groups

`groups` 定义用户组:

```json
{
  "groups": {
    "group:admins": ["alice@example.com", "bob@example.com"],
    "group:developers": ["developer@example.com"]
  }
}
```

## ACL 规则示例

### 基本规则

允许开发人员访问所有服务器:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["group:developers"],
      "dst": ["tag:server:*"]
    }
  ]
}
```

### 端口限制

只允许 SSH(22 端口)访问:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["group:developers"],
      "dst": ["tag:server:22"]
    }
  ]
}
```

### 多端口访问

允许访问多个端口:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["group:developers"],
      "dst": ["tag:server:22,80,443"]
    }
  ]
}
```

### 拒绝规则

拒绝特定访问:

```json
{
  "acls": [
    {
      "action": "reject",
      "src": ["group:interns"],
      "dst": ["tag:production:*"]
    }
  ]
}
```

### 用户间通信

允许用户之间的通信:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["alice@example.com"],
      "dst": ["bob@example.com:*"]
    }
  ]
}
```

## 标签系统

### 定义标签

```json
{
  "tagOwners": {
    "tag:web": ["group:admins"],
    "tag:db": ["group:admins"],
    "tag:dev": ["group:developers"]
  }
}
```

### 分配标签给设备

使用认证密钥创建时分配标签:

```bash
tailscale up --authkey=tskey-key --advertise-tags=tag:web
```

或在管理控制台手动分配。

### 使用标签在 ACL 中

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

## 高级 ACL 配置

### 层级规则

ACL 规则从上到下评估:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["group:admins"],
      "dst": ["*:*"]
    },
    {
      "action": "accept",
      "src": ["group:developers"],
      "dst": ["tag:dev:*"]
    },
    {
      "action": "reject",
      "src": ["*"],
      "dst": ["tag:production:*"]
    }
  ]
}
```

### 子网路由

允许访问子网:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["group:developers"],
      "dst": ["192.168.1.0/24:*"]
    }
  ]
}
```

### 通配符规则

允许所有通信(谨慎使用):

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["*"],
      "dst": ["*:*"]
    }
  ]
}
```

## ACL 最佳实践

### 1. 最小权限原则

只授予必要的权限:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["group:web-devs"],
      "dst": ["tag:web:80,443"]
    },
    {
      "action": "accept",
      "src": ["group:db-admins"],
      "dst": ["tag:db:3306"]
    }
  ]
}
```

### 2. 使用标签

标签比用户更灵活:

```json
{
  "tagOwners": {
    "tag:production": ["group:admins"],
    "tag:staging": ["group:admins", "group:developers"]
  }
}
```

### 3. 分组管理

使用组简化管理:

```json
{
  "groups": {
    "group:admins": ["alice@example.com", "bob@example.com"],
    "group:devops": ["charlie@example.com", "david@example.com"]
  }
}
```

### 4. 测试规则

使用 `tailscale acl check` 测试:

```bash
tailscale acl check --src alice@example.com --dst tag:server:22
```

### 5. 版本控制

将 ACL 文件保存到 Git:

```bash
git add acl-policy.json
git commit -m "Update ACL policy"
```

## ACL 管理

### 在管理控制台编辑

1. 登录 [Tailscale 管理控制台](https://login.tailscale.com/admin/acls)
2. 点击"Access Controls"
3. 编辑 ACL 配置
4. 点击"Save"保存

### 使用 API 更新

```bash
curl -X POST \
  https://api.tailscale.com/api/v2/tailnet/example.com/acl \
  -H "Authorization: Bearer tskey-api-key" \
  -d '{"acls": [...]}'
```

### 使用文件

保存 ACL 到文件:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["*"],
      "dst": ["*:*"]
    }
  ]
}
```

上传到 Tailscale:

```bash
tailscale acl policy.json
```

## ACL 示例模板

### 简单开发环境

```json
{
  "groups": {
    "group:devs": ["developer@example.com"]
  },
  "tagOwners": {
    "tag:dev": ["group:devs"]
  },
  "acls": [
    {
      "action": "accept",
      "src": ["group:devs"],
      "dst": ["tag:dev:*"]
    }
  ]
}
```

### 生产环境

```json
{
  "groups": {
    "group:admins": ["admin@example.com"],
    "group:devs": ["dev@example.com"],
    "group:readonly": ["viewer@example.com"]
  },
  "tagOwners": {
    "tag:production": ["group:admins"],
    "tag:staging": ["group:admins", "group:devs"]
  },
  "acls": [
    {
      "action": "accept",
      "src": ["group:admins"],
      "dst": ["*:*"]
    },
    {
      "action": "accept",
      "src": ["group:devs"],
      "dst": ["tag:staging:*"]
    },
    {
      "action": "accept",
      "src": ["group:readonly"],
      "dst": ["tag:production:80,443"]
    },
    {
      "action": "reject",
      "src": ["group:devs"],
      "dst": ["tag:production:*"]
    }
  ]
}
```

## 故障排除

### ACL 不生效

检查步骤:

1. 确认 ACL 已保存
2. 检查用户和标签是否正确
3. 使用 `tailscale acl check` 测试
4. 查看管理控制台的 ACL 状态

### 无法访问设备

可能原因:

- ACL 规则不允许
- 设备未正确标记
- 用户不在正确的组
- 端口未正确指定

### 测试 ACL

使用命令行测试:

```bash
# 测试用户访问
tailscale acl check --src alice@example.com --dst 100.100.100.100:22

# 测试标签访问
tailscale acl check --src tag:web --dst tag:db:3306
```

## 下一步

- [用户管理](/manage/users) - 管理用户权限
- [设备管理](/manage/devices) - 管理设备标签
- [子网路由器](/features/subnet-routers) - 配置子网访问