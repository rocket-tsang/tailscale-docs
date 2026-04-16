# Taildrop

Taildrop 允许在 Tailscale 网络中的个人设备之间发送文件。这是一个零信任安全的文件传输功能。

## 什么是 Taildrop?

Taildrop 是 Tailscale 提供的安全文件传输功能:

- 端到端加密的文件传输
- P2P 连接,无需第三方服务器
- 支持所有类型的文件
- 支持大文件传输
- 跨平台支持(macOS、iOS、Windows、Android、Linux)

Taildrop 目前处于 [alpha](/reference/tailscale-release-stages#alpha) 阶段,已在所有计划中可用。

## 启用 Taildrop

由于 Taildrop 是 alpha 功能,需要为您的 tailnet 选择加入:

1. 登录管理控制台的 [General](https://login.tailscale.com/admin/settings/general) 设置页面
2. 打开 **Send Files** 功能

## 客户端设置

除网络存储(NAS)设备外,Taildrop 无需额外客户端设置:

- 安装 Tailscale 后即可使用
- 需要 macOS 的共享扩展设置
- 网络存储设备请参考 [Taildrop with NAS](/features/taildrop/how-to/set-up-taildrop-with-nas)

### macOS 设置

在使用 Taildrop 之前,需要启用共享扩展:

```bash
系统偏好设置 > 通用 > 登录项和扩展 > 共享
启用 Tailscale 的共享功能
```

## 发送文件

### 使用右键菜单

在支持的平台上,使用右键菜单发送文件:

### 支持的平台

[Tailscale Taildrop](/features/taildrop?tab=macos)

- macOS
- iOS
- Windows
- Android
- Linux

### 限制

- 仅限个人设备之间传输
- 无法发送到其他用户拥有的设备
- 无法与标记设备之间传输
- 双方设备都必须运行 Tailscale

### 恢复中断的传输

如果传输中断,Taildrop 会尝试恢复:

- 大文件传输特别有用
- 大多数情况下 1 小时内可恢复
- 除 macOS/iOS 作为接收端外均支持

## 接收文件

### 文件保存位置

```bash
# macOS
~/Downloads

# Linux
~/Downloads

# Windows
%USERPROFILE%\Downloads

# Android
Downloads 目录

# iOS
文件应用
```

## 使用示例

### 示例 1: 安全传输敏感文档

在设备间传输敏感文件(如医疗或税务文件):

**问题**:
- 云服务存在安全风险
- iCloud/AirDrop 仅限 Apple 设备
- 需要近距离传输

**解决方案**:
```bash
# 任何设备间
# 加密 P2P 传输
# 无需上传到互联网
# 无需近距离
```

### 示例 2: 从手机发送家庭照片到电脑

无需上传到任何地方,跨平台共享照片:

```bash
# 手机照片
共享菜单 → Tailscale → 选择电脑

# 电脑接收
自动保存到 Downloads
```

### 示例 3: 共享截图到电脑

从移动设备快速传输截图:

```bash
# 拍摄屏幕截图
# 共享到电脑
# 在电脑上处理
```

### 示例 4: 传输 Google Photos 相册到个人媒体服务器

从 Google Photos 迁移到个人服务器:

步骤:

1. 从浏览器访问 Google Photos
2. 选择相册 → 下载全部
3. 下载 zip 文件
4. 右键点击 → 共享 → Tailscale
5. 选择媒体服务器
6. 传输完成后删除原始 zip 文件

## 技术细节

### 加密机制

```
发送设备 ───[WireGuard 加密]───► 接收设备
     │                               │
     │         P2P 直连              │
     │         (或中继)              │
  原始文件                        接收文件
```

### 连接方式

1. Tailscale 查找最佳连接路径
2. 尽可能使用 P2P 直连
3. 如需中继,使用 DERP 服务器
4. 端到端加密传输

## 最佳实践

### 1. 安全考虑

- Taildrop 使用 WireGuard 加密
- 仅限信任的 tailnet
- 检查接收设备
- 监控传输活动

### 2. 文件类型

支持任意文件:
- 文档(pdf、docx、xlsx)
- 图片(jpg、png、gif)
- 视频(mp4、mov)
- 音频(mp3、wav)
- 压缩文件(zip、tar)
- 任何二进制文件

### 3. 大文件处理

- 大文件自动分段
- 中断后可恢复
- 传输时间取决于带宽
- 支持巨型文件

### 4. 性能优化

- P2P 直连最快
- 中继速度较慢
- 双方设备位置影响速度
- 网络质量决定性能

## 故障排除

### 传输失败

检查步骤:

1. 确认 Taildrop 已启用
2. 验证双方设备在线
3. 检查网络连接
4. 查看设备权限设置

### 无法找到设备

- 确认设备在同一 tailnet
- 检查设备是否在线
- 验证共享设置
- 检查 Tailscale 版本

### 传输缓慢

可能原因:
- 使用中继而非直连
- 网络带宽限制
- 网络延迟高
- 防火墙限制

解决方法:
- 等待 NAT 穿透
- 检查网络质量
- 减少并发传输

## 扩展阅读

- [Tailscale 服务](/features/tailscale-services) - Tailscale 服务功能
- [共享节点](/features/sharing) - 设备共享
- [服务](/features/services) - 端点收集

## 下一步

- [Tailscale Serve](/features/tailscale-serve) - 共享 HTTP 服务
- [Tailscale Funnel](/features/tailscale-funnel) - 公网暴露服务
- [MagicDNS](/features/magicdns) - 自动 DNS 解析
