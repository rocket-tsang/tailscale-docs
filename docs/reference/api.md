# API 参考

Tailscale 提供 RESTful API 用于程序化管理您的 tailnet。

## API 概述

### API 密钥

使用 API 需要创建 API 密钥:

1. 登录 [管理控制台](https://login.tailscale.com/admin/settings/keys)
2. 点击"Generate API key"
3. 输入描述和过期时间
4. 生成密钥

API 密钥格式:

```
tskey-api-xxxxxxxxxxxx
```

### API 基础 URL

```
https://api.tailscale.com/api/v2/
```

### 认证

使用 Authorization header:

```bash
curl -H "Authorization: Bearer tskey-api-key" \
  https://api.tailscale.com/api/v2/...
```

### 响应格式

JSON 格式响应:

```json
{
  "status": "success",
  "data": {...}
}
```

## 设备管理

### 列出设备

```bash
GET /api/v2/tailnet/{tailnet}/devices
```

示例:

```bash
curl -H "Authorization: Bearer tskey-api-key" \
  https://api.tailscale.com/api/v2/tailnet/example.com/devices
```

响应:

```json
{
  "devices": [
    {
      "id": "device-id",
      "name": "device-name",
      "addresses": ["100.100.100.100"],
      "hostname": "hostname",
      "os": "linux",
      "user": "alice@example.com",
      "tags": ["tag:server"],
      "lastSeen": "2026-04-16T00:00:00Z"
    }
  ]
}
```

### 获取设备详情

```bash
GET /api/v2/tailnet/{tailnet}/devices/{deviceId}
```

示例:

```bash
curl -H "Authorization: Bearer tskey-api-key" \
  https://api.tailscale.com/api/v2/tailnet/example.com/devices/device-id
```

### 删除设备

```bash
DELETE /api/v2/tailnet/{tailnet}/devices/{deviceId}
```

示例:

```bash
curl -X DELETE \
  -H "Authorization: Bearer tskey-api-key" \
  https://api.tailscale.com/api/v2/tailnet/example.com/devices/device-id
```

### 授权设备

```bash
POST /api/v2/tailnet/{tailnet}/devices/{deviceId}/approve
```

示例:

```bash
curl -X POST \
  -H "Authorization: Bearer tskey-api-key" \
  https://api.tailscale.com/api/v2/tailnet/example.com/devices/device-id/approve
```

## ACL 管理

### 获取 ACL

```bash
GET /api/v2/tailnet/{tailnet}/acl
```

示例:

```bash
curl -H "Authorization: Bearer tskey-api-key" \
  https://api.tailscale.com/api/v2/tailnet/example.com/acl
```

响应:

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

### 更新 ACL

```bash
POST /api/v2/tailnet/{tailnet}/acl
```

示例:

```bash
curl -X POST \
  -H "Authorization: Bearer tskey-api-key" \
  -H "Content-Type: application/json" \
  -d '{"acls": [...]}' \
  https://api.tailscale.com/api/v2/tailnet/example.com/acl
```

### 验证 ACL

```bash
POST /api/v2/tailnet/{tailnet}/acl/validate
```

示例:

```bash
curl -X POST \
  -H "Authorization: Bearer tskey-api-key" \
  -H "Content-Type: application/json" \
  -d '{"acls": [...]}' \
  https://api.tailscale.com/api/v2/tailnet/example.com/acl/validate
```

## 认证密钥管理

### 创建认证密钥

```bash
POST /api/v2/tailnet/{tailnet}/keys
```

请求体:

```json
{
  "capabilities": {
    "devices": {
      "create": {
        "tags": ["tag:server"]
      }
    }
  },
  "expirySeconds": 3600,
  "description": "Auth key for servers"
}
```

示例:

```bash
curl -X POST \
  -H "Authorization: Bearer tskey-api-key" \
  -H "Content-Type: application/json" \
  -d '{"capabilities": {...}}' \
  https://api.tailscale.com/api/v2/tailnet/example.com/keys
```

响应:

```json
{
  "key": "tskey-auth-xxxxxxxxxxxx"
}
```

### 列出认证密钥

```bash
GET /api/v2/tailnet/{tailnet}/keys
```

示例:

```bash
curl -H "Authorization: Bearer tskey-api-key" \
  https://api.tailscale.com/api/v2/tailnet/example.com/keys
```

### 删除认证密钥

```bash
DELETE /api/v2/tailnet/{tailnet}/keys/{keyId}
```

示例:

```bash
curl -X DELETE \
  -H "Authorization: Bearer tskey-api-key" \
  https://api.tailscale.com/api/v2/tailnet/example.com/keys/key-id
```

## 用户管理

### 列出用户

```bash
GET /api/v2/tailnet/{tailnet}/users
```

示例:

```bash
curl -H "Authorization: Bearer tskey-api-key" \
  https://api.tailscale.com/api/v2/tailnet/example.com/users
```

响应:

```json
{
  "users": [
    {
      "id": "user-id",
      "loginName": "alice@example.com",
      "displayName": "Alice",
      "role": "admin"
    }
  ]
}
```

### 更改用户角色

```bash
POST /api/v2/tailnet/{tailnet}/users/{userId}
```

请求体:

```json
{
  "role": "admin"
}
```

示例:

```bash
curl -X POST \
  -H "Authorization: Bearer tskey-api-key" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}' \
  https://api.tailscale.com/api/v2/tailnet/example.com/users/user-id
```

### 删除用户

```bash
DELETE /api/v2/tailnet/{tailnet}/users/{userId}
```

示例:

```bash
curl -X DELETE \
  -H "Authorization: Bearer tskey-api-key" \
  https://api.tailscale.com/api/v2/tailnet/example.com/users/user-id
```

## DNS 配置

### 获取 DNS 配置

```bash
GET /api/v2/tailnet/{tailnet}/dns
```

示例:

```bash
curl -H "Authorization: Bearer tskey-api-key" \
  https://api.tailscale.com/api/v2/tailnet/example.com/dns
```

### 更新 DNS 配置

```bash
POST /api/v2/tailnet/{tailnet}/dns
```

请求体:

```json
{
  "nameservers": ["8.8.8.8", "8.8.4.4"],
  "searchPaths": ["example.com"]
}
```

示例:

```bash
curl -X POST \
  -H "Authorization: Bearer tskey-api-key" \
  -H "Content-Type: application/json" \
  -d '{"nameservers": [...]}' \
  https://api.tailscale.com/api/v2/tailnet/example.com/dns
```

## Tailnet 信息

### 获取 Tailnet 详情

```bash
GET /api/v2/tailnet/{tailnet}
```

示例:

```bash
curl -H "Authorization: Bearer tskey-api-key" \
  https://api.tailscale.com/api/v2/tailnet/example.com
```

响应:

```json
{
  "name": "example.com",
  "domain": "example.com",
  "creationTime": "2026-01-01T00:00:00Z"
}
```

## Webhooks

### 创建 Webhook

```bash
POST /api/v2/tailnet/{tailnet}/webhooks
```

请求体:

```json
{
  "endpointUrl": "https://example.com/webhook",
  "events": ["nodeCreated", "nodeDeleted"]
}
```

示例:

```bash
curl -X POST \
  -H "Authorization: Bearer tskey-api-key" \
  -H "Content-Type: application/json" \
  -d '{"endpointUrl": "..."}' \
  https://api.tailscale.com/api/v2/tailnet/example.com/webhooks
```

### 列出 Webhooks

```bash
GET /api/v2/tailnet/{tailnet}/webhooks
```

示例:

```bash
curl -H "Authorization: Bearer tskey-api-key" \
  https://api.tailscale.com/api/v2/tailnet/example.com/webhooks
```

### 删除 Webhook

```bash
DELETE /api/v2/tailnet/{tailnet}/webhooks/{webhookId}
```

示例:

```bash
curl -X DELETE \
  -H "Authorization: Bearer tskey-api-key" \
  https://api.tailscale.com/api/v2/tailnet/example.com/webhooks/webhook-id
```

## 错误处理

### 响应状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 未找到 |
| 500 | 服务器错误 |

### 错误响应格式

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## API 限制

### 速率限制

API 有速率限制:

- 每分钟请求次数限制
- 超过限制返回 429 错误
- 需要等待后重试

### 权限要求

某些 API 需要特定权限:

- Admin 权限:管理用户、ACL
- Member 权限:查看设备状态
- Owner 权限:管理订阅

## SDK 和客户端库

### Go SDK

```go
import "tailscale.com/client/tailscale"

client := tailscale.NewClient("tskey-api-key")
devices, err := client.ListDevices()
```

### Python 客户端

```python
import requests

headers = {"Authorization": "Bearer tskey-api-key"}
response = requests.get(
    "https://api.tailscale.com/api/v2/tailnet/example.com/devices",
    headers=headers
)
```

### JavaScript 客户端

```javascript
const response = await fetch(
  "https://api.tailscale.com/api/v2/tailnet/example.com/devices",
  {
    headers: {
      "Authorization": "Bearer tskey-api-key"
    }
  }
);
```

## 最佳实践

### 1. 安全存储密钥

- 不要在代码中硬编码密钥
- 使用环境变量
- 定期轮换密钥
- 限制密钥权限

### 2. 错误处理

处理所有可能的错误:

```bash
response = curl ...
if response.status != 200:
  handle_error(response)
```

### 3. 缓存结果

缓存频繁访问的数据:

- 设备列表
- ACL 配置
- 用户列表

### 4. 使用 Webhooks

使用 Webhooks 替代轮询:

- 事件驱动更新
- 减少 API 调用
- 实时响应

### 5. 版本控制

使用 API 版本:

- 使用 `/api/v2/`
- 关注版本更新
- 测试新版本

## 下一步

- [CLI 参考](/reference/cli) - 命令行工具
- [访问控制](/features/access-control) - ACL 配置
- [认证密钥](/reference/auth-keys) - 密钥管理