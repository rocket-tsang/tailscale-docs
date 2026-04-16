# 核心概念

了解 Tailscale 的核心概念和术语,帮助您更好地理解和使用 Tailscale。

## 基础概念

### Tailnet

**Tailnet** 是您的私有网络。

- 每个 Tailscale 账户都有一个 tailnet
- Tailnet 内的设备可以直接相互通信
- 每个 tailnet 都是独立的,与其他 tailnet 隔离
- 可以包含多个用户和设备

示例:

```
您的 Tailnet
├── 设备 A (100.100.100.100)
├── 设备 B (100.100.100.101)
├── 设备 C (100.100.100.102)
└── 用户 Alice, Bob
```

### Node(节点)

**Node** 是连接到 tailnet 的设备。

- 每个设备都有一个唯一的 Tailscale IP 地址(100.x.x.x)
- 节点可以是物理设备、虚拟机或容器
- 每个节点都有一个唯一的密钥对

### IP 地址

Tailscale 使用两种类型的 IP 地址:

#### Tailscale IP(100.x.x.x)

- 每个节点分配一个唯一的 100.x.x.x 地址
- 用于 tailnet 内部通信
- 自动分配,无需手动配置
- IPv6 地址也支持(fd7a:115c:a1e0::/48)

#### 本地 IP

- 设备原有的局域网 IP 地址
- 可以通过子网路由器访问
- 用于访问非 Tailscale 设备

### MagicDNS

**MagicDNS** 自动为您的设备提供 DNS 名称。

- 设备可以通过名称访问,无需记住 IP
- 格式:`设备名.tailnet名.ts.net`
- 自动更新,无需手动维护
- 支持自定义域名

示例:

```
device-alice.ts.net  →  100.100.100.100
server-bob.ts.net    →  100.100.100.101
```

## 网络组件

### Subnet Router(子网路由器)

**子网路由器** 允许您访问非 Tailscale 设备。

- 将本地网络子网广播到 tailnet
- 其他设备可以访问子网内的设备
- 无需在每个设备上安装 Tailscale

示例配置:

```bash
# 将 192.168.1.0/24 子网广播到 tailnet
tailscale up --advertise-routes=192.168.1.0/24
```

### Exit Node(出口节点)

**出口节点** 让您通过特定设备路由所有流量。

- 所有互联网流量通过出口节点
- 可用于隐私保护或访问地理限制内容
- 类似于传统 VPN 的工作方式

配置示例:

```bash
# 将此设备配置为出口节点
tailscale up --advertise-exit-node

# 在其他设备上使用出口节点
tailscale up --exit-node=device-name
```

### DERP Relay(DERP 中继)

**DERP** 是 Tailscale 的中继服务器网络。

- 当直连不可用时使用
- 全球分布的中继服务器
- 自动选择最近的服务器
- 仅处理加密流量,无法解密内容

### Coordination Server(协调服务器)

**协调服务器** 管理 tailnet 的元数据。

- 不处理实际数据流量
- 分发公钥和设备信息
- 管理访问控制策略
- 同步网络状态

## 安全模型

### WireGuard® 协议

Tailscale 基于 WireGuard 构建:

- 现代加密协议
- 高性能和低延迟
- 简洁的代码库
- 易于审计

加密特性:

- Curve25519 密钥交换
- ChaCha20-Poly1305 加密
- BLAKE2s 哈希
- 完美前向保密

### Identity Provider(身份提供商)

Tailscale 支持多种身份提供商:

- Google Workspace
- Microsoft Azure AD
- Okta
- OneLogin
- GitHub
- GitLab

### Access Control Lists(ACL)

**ACL** 控制设备之间的访问权限。

- 基于策略的访问控制
- 细粒度的权限管理
- JSON 格式的配置文件
- 支持标签和分组

示例 ACL:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["tag:server"],
      "dst": ["tag:database:*"]
    },
    {
      "action": "accept",
      "src": ["group:developers"],
      "dst": ["tag:server:22"]
    }
  ]
}
```

### Tags(标签)

**标签** 用于组织和控制设备访问。

- 替代用户权限
- 可以分配给设备
- 用于 ACL 策略
- 支持层级结构

示例:

```
tag:web-server
tag:database
tag:development
tag:production
```

## 密钥管理

### Node Key(节点密钥)

每个节点都有一个密钥对:

- **私钥**:保存在设备上,从不传输
- **公钥**:发送到协调服务器,分发给其他节点
- **周期性轮换**:自动更新密钥

### Auth Key(认证密钥)

**认证密钥** 用于无交互地注册设备。

- 用于自动化部署
- 可以设置过期时间
- 可以限制使用次数
- 可以分配标签

创建认证密钥:

```bash
# 在管理控制台创建
# 或使用 API
tailscale authkey create
```

### Pre-auth Key

预认证密钥与认证密钥相同:

- 允许设备加入 tailnet
- 无需用户交互
- 适合批量部署

## 网络拓扑

### Mesh Network(网状网络)

Tailscale 尝试建立网状网络:

- 设备之间直接连接
- 无中心瓶颈
- 高性能和低延迟
- 自动故障恢复

### NAT Traversal(NAT 穿透)

Tailscale 自动处理 NAT:

- 支持 UPnP 和 NAT-PMP
- STUN 协议检测 NAT 类型
- 自动选择最佳连接方式
- 中继作为最后手段

## 流量路由

### Split DNS

**Split DNS** 允许根据域名决定 DNS 解析:

- 特定域名使用 tailnet DNS
- 其他域名使用本地 DNS
- 支持自定义 DNS 服务器

### Global Nameservers

全局 DNS 服务器配置:

- 为整个 tailnet 设置 DNS
- 支持 IPv4 和 IPv6
- 可以使用公共 DNS 或私有 DNS

### Restricted Nameservers

受限 DNS 服务器:

- 仅响应特定域名的查询
- 用于访问内部服务
- 提高安全性

## 监控和日志

### Network Flow Logs

网络流量日志记录:

- 连接元数据
- 源和目标地址
- 协议和端口
- 不记录实际数据内容

### Audit Logs

审计日志记录管理操作:

- 用户登录和注销
- 设备授权和移除
- ACL 更改
- 密钥创建和删除

### Client Metrics

客户端指标:

- 连接状态
- 带宽使用
- 延迟统计
- DERP 使用情况

## 高级功能

### Tailscale SSH

通过 Tailscale 进行 SSH 访问:

- 无需管理 SSH 密钥
- 基于 ACL 的访问控制
- 支持审计日志
- 集成身份提供商

### Tailscale Serve

内置 HTTP 服务器:

- 快速共享本地服务
- 支持 HTTPS
- 自定义域名
- 简单配置

### Tailscale Funnel

将本地服务暴露到公网:

- 安全地共享服务
- 支持自定义域名
- 访问控制
- 临时共享

## 概念总结

```
┌─────────────────────────────────────────┐
│              Tailnet                     │
│                                          │
│  ┌──────┐      ┌──────┐      ┌──────┐   │
│  │ Node │◄────►│ Node │◄────►│ Node │   │
│  └──────┘      └──────┘      └──────┘   │
│      │             │             │       │
│      └─────────────┴─────────────┘       │
│                    │                     │
│              Subnet Router               │
│                    │                     │
│              Local Network               │
└─────────────────────────────────────────┘
```

## 下一步

- [快速入门](/getting-started/quickstart) - 开始使用 Tailscale
- [访问控制](/features/access-control) - 配置安全策略
- [子网路由器](/features/subnet-routers) - 扩展网络访问