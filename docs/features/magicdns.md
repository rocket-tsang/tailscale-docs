# MagicDNS

MagicDNS 自动为网络中的设备注册 DNS 名称,简化设备访问。

## 什么是 MagicDNS?

MagicDNS 是 Tailscale 提供的自动化 DNS 服务:

- 自动为 tailnet 中的设备生成 DNS 记录
- 无需手动配置 DNS 服务器
- 使用设备的机器名称作为 DNS 名称
- 支持完整的域名(FQDN)

MagicDNS 在 Tailscale v1.20 或更高版本中无需 DNS nameserver。旧版本需要至少设置一个 DNS nameserver。

## 启用 MagicDNS

尾网络在 2022 年 10 月 20 日或之后创建的已默认启用 MagicDNS。

## 访问 MagicDNS 设备

启用后,可以使用设备名称访问网络中的任何设备:

```bash
# SSH 访问
ssh username@monitoring

# Ping 测试
ping monitoring

# 浏览器访问
monitoring
```

注意:macOS 上的 `host` 或 `nslookup` 等 CLI 工具会绕过系统 DNS 解析,可能不适用于 MagicDNS。

## 机器名称

MagicDNS 使用设备的[机器名称](/concepts/machine-names)作为 DNS 条件的一部分:

- 修改设备名称会自动更新 MagicDNS 记录
- 可以在设备设置中编辑机器名称
- 推荐使用描述性的名称

## 完整域名 vs 机器名称

MagicDNS 会为每个设备生成**完整域名**(FQDN),由两部分组成:

1. **机器名称**:可更改的设备名称
2. **Tailnet DNS 名称**:在 DNS 设置页面可找到

例如:

```
机器名称: monitoring
Tailnet 名称: yak-bebop.ts.net
完整域名: monitoring.yak-bebop.ts.net
```

### 短名称与完整名称

完整域名可能较长,因此 Tailscale 会自动添加**搜索域名**:

```bash
# 这两个命令等效
ping monitoring
ping monitoring.yak-bebop.ts.net
```

大多数情况下使用机器名称即可。但对于共享设备,需要使用完整域名。

### 旧版域名迁移

以前的域名格式 `.beta.tailscale.net` 已于 2024 年 9 月 13 日停止支持。

迁移步骤:

1. 登录管理控制台 DNS 页面
2. 找到 `.beta.tailscale.net` nameserver
3. 删除并使用新的 `.ts.net` 域名

## 禁用 MagicDNS

如需禁用,在 DNS 设置页面关闭 MagicDNS 开关:

```bash
# Linux - 停止接受 DNS
tailscale set --accept-dns=false

# macOS - 在 Tailscale 菜单栏选择 Preferences,取消勾选 Use Tailscale DNS settings

# Windows - 按住 SHIFT 右键点击 Tailscale 系统 tray 图标,取消勾选 Use Tailscale DNS
```

## 技术细节

### DNS 结构

```
┌─────────────────────────────────────┐
│        设备 A (monitoring)          │
│        100.x.x.x                    │
└──────────────┬──────────────────────┘
               │
               ├─► DNS: monitoring.tailnet.ts.net
               │
┌──────────────▼──────────────────────┐
│        设备 B (webserver)           │
│        100.y.y.y                    │
└──────────────┬──────────────────────┘
               │
               ├─► DNS: webserver.tailnet.ts.net
```

### 搜索域名

MagicDNS 会为每个 tailnet 添加搜索域名:

```json
{
  "searchDomains": ["tailnet.ts.net"]
}
```

这样可以使用短名称访问设备。

## 最佳实践

### 1. 命名规范

- 使用描述性的机器名称
- 保持名称简洁清晰
- 避免特殊字符

### 2. 域名管理

- 优先使用机器名称
- 共享设备使用完整域名
- 定期检查域名解析

### 3. 过渡期处理

- 迁移到新的 `.ts.net` 域名
- 删除旧的 `.beta.tailscale.net` nameserver
- 更新所有引用

## 故障排除

### DNS 解析失败

检查步骤:

1. 确认 MagicDNS 已启用
2. 检查设备是否在线
3. 验证机器名称正确
4. 确认 DNS 设置正确

### 特定工具不工作

- `ping` 和 `ssh` 通常工作正常
- `host` 和 `nslookup` 可能不工作(绕过系统 DNS)
- 建议使用 Tailscale 支持的工具

### 共享设备访问

- 确保使用完整域名
- 验证设备已共享
- 检查 Tailscale 版本(需 v1.4+)

## 示例配置

### 基本使用

```bash
# 设置机器名称
sudo hostnamectl set-hostname webserver

# 验证 DNS 解析
ping webserver.yourtailnet.ts.net
```

### 多设备访问

```bash
# 访问数据库
ssh admin@database

# 访问文件服务器
ssh admin@files

# 访问监控系统
ssh admin@monitoring
```

## 扩展阅读

- [DNS in Tailscale](/reference/dns-in-tailscale) - 了解 Tailscale 中的 DNS 设置
- [机器名称](/concepts/machine-names) - 机器名称详细说明
- [访问控制](/features/access-control) - 配置访问策略

## 下一步

- [访问控制](/features/access-control) - 配置 ACL
- [用户管理](/manage/users) - 管理用户权限
- [设备管理](/manage/devices) - 管理设备标签
