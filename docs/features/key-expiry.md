# 密钥过期

作为安全功能,用户需要定期在每个设备上重新认证。默认过期周期取决于您的域名设置。新域名默认设置为 180 天的过期周期。

如果未进行重新认证,密钥将过期,与给定端点的连接将停止工作。

## 禁用密钥过期

禁用密钥过期适用于[所有计划](/pricing)。

可能希望在一些设备上禁用密钥过期,如受信任的服务器、[子网路由器](/features/subnet-routers)或难以到达的远程 IoT 设备。

### 在管理控制台禁用

```
1. 打开管理控制台的 Machines 页面
2. 找到设备行
3. 选择最右边的"..."菜单
4. 选择"Disable Key Expiry"选项
```

### CLI 禁用

```bash
# 设置密钥不过期
tailscale up --distinct-visitor-tracking=false

# 或在管理控制台禁用
```

## 启用密钥过期

启用密钥过期适用于[所有计划](/pricing)。

### 在管理控制台启用

```
1. 打开管理控制台的 Machines 页面
2. 找到设备行
3. 选择最右边的"..."菜单
4. 选择"Enable Key Expiry"选项
```

### CLI 启用

```bash
# 重新认证设备
tailscale up --force-reauth

# 或在管理控制台启用
```

## 为过期设备续订密钥

如果设备密钥过期,与给定端点的连接将停止工作。

对于有[Tailscale CLI](/reference/tailscale-cli)的设备,运行 [`tailscale up --force-reauth`](/reference/tailscale-cli/up) 将续订密钥。

注意:`tailscale up --force-reauth` 可能会破坏 tailnet 连接,因此不应在 SSH 或 RDP 上远程执行,除非有备用登录方式。

### 对受限设备的访问

对于[仅限 Tailscale 流量](/how-to/secure-ubuntu-server-with-ufw)的远程设备,没有 Tailscale 访问可能很难或不可能登录。在这种情况下,我们允许网络管理员临时延长密钥生命周期以帮助设备所有者恢复访问并重新认证。

#### 恢复访问

```
1. 打开管理控制台的 Machines 页面
2. 找到设备行
3. 选择最右边的"..."菜单
4. 选择"Temporarily extend key"选项
5. 告知设备所有者在扩展时间内登录
6. 一旦重新认证,密钥应为标准过期时间
```

### 30 分钟延长

密钥将延长 30 分钟。在此时间内:

- 登录设备
- 重新认证
- 或禁用该设备的密钥过期

## 与标记设备一起使用密钥过期

当首次应用标签并认证标记设备时,标记设备的[密钥过期](/features/access-control/key-expiry)默认禁用。

## 设置自定义认证周期

设置自定义认证周期适用于[所有计划](/pricing)。

```
1. 打开管理控制台的 Device management 页面
2. 在"Key Expiry"部分,选择 1 到 180 天作为自定义认证周期
3. 选择"Save"
```

更改将应用于重新登录后的设备。已登录设备的密钥过期保持不变。

## 管理控制台会话过期

访问 Tailscale [管理控制台](https://login.tailscale.com/admin) 的浏览器会话有 30 天的过期。这与任何密钥过期无关。

## 最佳实践

### 1. 安全与便利平衡

- 关键服务器禁用过期
- 高安全性环境启用过期
- 移动设备使用中等周期

### 2. 监控过期

- 跟踪即将过期的密钥
- 提前通知
- 自动续订

### 3. 文档化

- 记录过期设置
- 文档化例外
- 创建检查清单

### 4. 测试

- 定期测试过期
- 验证续订流程
- 检查通知

## 故障排除

### 密钥过期不工作

检查步骤:

1. 确认设置已保存
2. 验证设备重新登录
3. 检查网络连接
4. 查看日志

### 无法续订

可能原因:

- 设备离线
- 网络连接问题
- API 访问被限制

### 临时延长不工作

- 检查设备在线
- 验证管理员权限
- 确认密钥状态
- 查看错误日志

## 扩展阅读

- [认证密钥](/features/access-control/auth-keys) - 认证密钥
- [标签](/features/tags) - 标签系统
- [访问控制](/features/access-control) - ACL 管理

## 下一步

- [认证密钥](/features/access-control/auth-keys) - 密钥管理
- [标签](/features/tags) - 标签系统
- [访问控制](/features/access-control) - ACL 配置
