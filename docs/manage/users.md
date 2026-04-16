# 用户管理

了解如何在您的 tailnet 中管理用户,包括邀请用户、分配角色、移除用户等操作。

## 用户角色

Tailscale 提供不同的用户角色,每个角色有不同的权限:

### Owner(所有者)

- 创建 tailnet 的用户
- 最高权限
- 可以管理所有设置
- 无法删除(除非删除整个 tailnet)

### Admin(管理员)

- 管理 tailnet 设置
- 管理用户和设备
- 配置 ACL
- 无法删除 Owner

### Member(成员)

- 连接到 tailnet
- 与其他设备通信
- 受 ACL 约束
- 无法管理设置

### Role 权限对比

| 操作 | Owner | Admin | Member |
|------|-------|-------|--------|
| 连接设备 | ✅ | ✅ | ✅ |
| 访问资源 | ✅ | ✅ | ✅ |
| 管理设备 | ✅ | ✅ | ❌ |
| 管理用户 | ✅ | ✅ | ❌ |
| 配置 ACL | ✅ | ✅ | ❌ |
| 管理订阅 | ✅ | ✅ | ❌ |
| 删除 tailnet | ✅ | ❌ | ❌ |

## 邆请用户

### 方法一:邮件邀请

1. 登录 [管理控制台](https://login.tailscale.com/admin/users)
2. 点击"Invite user"
3. 输入用户的邮箱地址
4. 点击"Send invite"

用户会收到邀请邮件,点击链接即可加入。

### 方法二:共享链接

1. 登录管理控制台
2. 点击"Invite user"
3. 选择"Generate invite link"
4. 复制链接并发送给用户

用户点击链接即可加入。

### 方法三:邀请码

在 ACL 中配置邀请码:

```json
{
  "inviteCodes": ["CODE123"]
}
```

用户可以使用邀请码注册。

## 分配角色

### 在管理控制台分配

1. 登录管理控制台
2. 点击"Users"
3. 找到用户
4. 点击角色下拉菜单
5. 选择新角色
6. 保存更改

### 使用 API 分配

```bash
curl -X POST \
  https://api.tailscale.com/api/v2/tailnet/example.com/users/user@example.com \
  -H "Authorization: Bearer tskey-api-key" \
  -d '{"role": "admin"}'
```

## 移除用户

### 在管理控制台移除

1. 登录管理控制台
2. 点击"Users"
3. 找到用户
4. 点击"..."菜单
5. 选择"Remove user"
6. 确认操作

### 使用 API 移除

```bash
curl -X DELETE \
  https://api.tailscale.com/api/v2/tailnet/example.com/users/user@example.com \
  -H "Authorization: Bearer tskey-api-key"
```

## 管理用户组

### 创建用户组

在 ACL 中定义组:

```json
{
  "groups": {
    "group:admins": ["alice@example.com", "bob@example.com"],
    "group:developers": ["dev1@example.com", "dev2@example.com"],
    "group:readonly": ["viewer@example.com"]
  }
}
```

### 添加用户到组

更新 ACL:

```json
{
  "groups": {
    "group:developers": ["dev1@example.com", "dev2@example.com", "newdev@example.com"]
  }
}
```

### 在 ACL 中使用组

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

## 身份提供商集成

### Google Workspace

配置 Google Workspace:

1. 登录管理控制台
2. 点击"Settings"
3. 选择"Identity provider"
4. 点击"Configure Google Workspace"
5. 授予必要的权限
6. 保存配置

### Microsoft Azure AD

配置 Azure AD:

1. 登录管理控制台
2. 点击"Identity provider"
3. 选择"Azure AD"
4. 输入 Tenant ID
5. 授权应用
6. 保存配置

### Okta

配置 Okta:

1. 在 Okta 创建 OIDC 应用
2. 配置 SSO 设置
3. 在 Tailscale 添加 Okta
4. 测试连接

### GitHub

配置 GitHub:

1. 登录管理控制台
2. 选择"GitHub"
3. 授权 GitHub 组织
4. 选择组织成员
5. 保存配置

## 用户设置

### 用户偏好

用户可以设置:

- 显示名称
- Profile picture
- 联系偏好
- 通知设置

### 切换账户

用户可以属于多个 tailnet:

```bash
tailscale switch
```

列出所有账户:

```bash
tailscale auth list
```

## 最佳实践

### 1. 角色分配

- 只授予必要的角色
- Owner 应限制数量
- Admin 应谨慎分配
- 默认为 Member

### 2. 用户组

使用组简化管理:

```json
{
  "groups": {
    "group:devops": ["alice@example.com", "bob@example.com"],
    "group:developers": ["dev@example.com"]
  }
}
```

### 3. 定期审查

定期检查:

- 用户列表
- 角色分配
- 组成员
- 活跃状态

### 4. SSO 集成

使用身份提供商:

- 统一身份管理
- 自动用户同步
- 简化登录流程
- 更好的安全控制

### 5. 文档化

记录:

- 用户角色说明
- 组的定义
- 加入流程
- 权限说明

## 故障排除

### 用户无法加入

检查:

- 邀请是否发送
- 邮件是否收到
- 邀请链接是否有效
- 身份提供商配置

### 用户权限问题

检查:

- 用户角色
- ACL 配置
- 组成员资格
- 设备标签

### SSO 问题

检查:

- IdP 配置
- 授权设置
- 用户映射
- 日志记录

## 下一步

- [设备管理](/manage/devices) - 管理设备
- [访问控制](/features/access-control) - 配置 ACL
- [身份提供商](/integrations/identity) - 配置 SSO