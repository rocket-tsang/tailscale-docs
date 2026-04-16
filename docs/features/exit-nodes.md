# 出口节点

出口节点允许您将所有互联网流量通过特定的 Tailscale 设备路由,提供隐私保护和访问地理限制内容的能力。

## 什么是出口节点?

出口节点是一个特殊的 Tailscale 设备,充当您整个 tailnet 的"VPN 服务器":

- 所有流量通过出口节点发出
- 类似传统 VPN 的功能
- 可以访问地理限制内容
- 提供隐私保护

### 工作原理

```
您的设备 ────► 出口节点 ────► 互联网
    │              │
    │              │
100.x.x.x      公网IP
```

### 使用场景

- 从公共 WiFi 安全上网
- 访问地理限制内容
- 绕过公司网络限制
- 统一的出口点
- 隐藏真实 IP 地址

## 设置出口节点

### 第一步:选择出口节点设备

选择一个设备作为出口节点:

- 云服务器(AWS、GCP、Azure)
- VPS(DigitalOcean、Linode)
- 家庭服务器
- Raspberry Pi

建议:

- 选择地理位置合适的设备
- 确保稳定的网络连接
- 有足够的带宽

### 第二步:配置为出口节点

在出口节点设备上运行:

```bash
sudo tailscale up --advertise-exit-node
```

### 第三步:批准出口节点

在管理控制台批准:

1. 登录 [Tailscale 管理控制台](https://login.tailscale.com/admin/machines)
2. 找到出口节点设备
3. 点击"..."菜单
4. 选择"Approve exit node"

### 第四步:使用出口节点

在其他设备上使用出口节点:

```bash
# 使用特定的出口节点
sudo tailscale up --exit-node=exit-node-name

# 或使用 IP 地址
sudo tailscale up --exit-node=100.100.100.100
```

### 第五步:验证

检查是否在使用出口节点:

```bash
tailscale status
```

输出会显示:

```
100.100.100.100  exit-node    alice@example.com  linux -
                 exit node: using

您的设备          alice@example.com  linux -
                 exit node: 100.100.100.100
```

测试 IP 地址:

```bash
curl ifconfig.me
```

应该显示出口节点的公网 IP,而不是您的真实 IP。

## Linux 配置

### IP Forwarding

启用 IP forwarding:

```bash
# 临时启用
sudo sysctl -w net.ipv4.ip_forward=1

# 永久启用
echo 'net.ipv4.ip_forward=1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### NAT 配置

使用 iptables 配置 NAT:

```bash
# 启用 MASQUERADE
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# 允许转发
sudo iptables -A FORWARD -i tailscale0 -o eth0 -j ACCEPT
sudo iptables -A FORWARD -i eth0 -o tailscale0 -m state --state ESTABLISHED,RELATED -j ACCEPT
```

保存规则:

```bash
sudo iptables-save > /etc/iptables/rules.v4
```

### 防火墙配置

如果使用 UFW:

```bash
sudo ufw allow forwarding
```

如果使用 firewalld:

```bash
sudo firewall-cmd --add-masquerade
sudo firewall-cmd --add-forward
```

## 高级配置

### 同时作为子网路由器和出口节点

设备可以同时担任两种角色:

```bash
sudo tailscale up --advertise-exit-node --advertise-routes=192.168.1.0/24
```

### 多个出口节点

可以设置多个出口节点:

```bash
# 在设备 A 上(美国)
sudo tailscale up --advertise-exit-node

# 在设备 B 上(欧洲)
sudo tailscale up --advertise-exit-node
```

用户可以选择使用哪个出口节点。

### 允许 LAN 访问

使用出口节点时仍然访问本地 LAN:

```bash
tailscale up --exit-node=exit-node --exit-node-allow-lan-access
```

这样:

- 互联网流量通过出口节点
- 本地 LAN 流量直接访问

### DNS 配置

配置 DNS 行为:

```bash
# 使用出口节点的 DNS
tailscale up --exit-node=exit-node --accept-dns

# 使用本地 DNS
tailscale up --exit-node=exit-node --accept-dns=false
```

## ACL 控制

使用 ACL 控制谁可以使用出口节点:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["group:admins"],
      "dst": ["tag:exit-node:*"]
    }
  ],
  "tagOwners": {
    "tag:exit-node": ["group:admins"]
  }
}
```

## 性能优化

### 选择合适的设备

考虑因素:

- CPU 性能
- 网络带宽
- 地理位置
- 网络延迟

### 监控性能

检查出口节点负载:

```bash
tailscale status
```

测试延迟:

```bash
tailscale ping exit-node
```

### 多出口节点负载均衡

设置多个出口节点:

- 不同地理位置
- 自动故障转移
- 用户可手动选择

## 故障排除

### 无法连接到出口节点

检查步骤:

1. 确认出口节点已批准
2. 确认 IP forwarding 已启用
3. 检查 NAT 配置
4. 检查防火墙规则

### 速度慢

可能原因:

- 出口节点带宽不足
- 网络延迟高
- CPU 性能不足
- 防火墙规则过多

解决方法:

- 使用高性能设备
- 选择更近的出口节点
- 简化防火墙规则
- 增加带宽

### DNS 不工作

检查 DNS 配置:

```bash
tailscale dns status
```

使用本地 DNS:

```bash
tailscale up --exit-node=exit-node --accept-dns=false
```

### 某些网站无法访问

可能原因:

- 网站阻止了出口节点 IP
- 出口节点地理位置限制
- DNS 问题

解决方法:

- 更换出口节点
- 使用不同地理位置的节点
- 检查 DNS 设置

## 安全考虑

### 信任出口节点

使用出口节点意味着:

- 所有流量通过该设备
- 出口节点可以看到您的流量目标
- 需要信任出口节点操作者

建议:

- 使用您控制的设备
- 定期监控出口节点
- 使用 HTTPS 加密流量

### ACL 保护

使用 ACL 限制:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["group:authorized-users"],
      "dst": ["tag:exit-node:*"]
    }
  ]
}
```

### 监控和日志

启用网络日志:

- 监控出口节点使用
- 记录连接信息
- 检测异常行为

## 最佳实践

### 1. 选择安全的位置

- 使用可靠的云服务商
- 选择隐私友好的地区
- 定期更新系统

### 2. 性能监控

- 监控带宽使用
- 检查延迟
- 设置告警

### 3. 冗余配置

- 多个出口节点
- 不同地理位置
- 自动故障转移

### 4. 安全配置

- 定期更新系统
- 配置防火墙
- 启用日志

### 5. 文档化

记录:

- 出口节点位置
- 配置详情
- ACL 规则
- 使用政策

## 示例配置

### AWS EC2 出口节点

创建 EC2 实例:

```bash
# 安装 Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# 配置出口节点
sudo tailscale up --advertise-exit-node

# 启用 IP forwarding
sudo sysctl -w net.ipv4.ip_forward=1
```

### DigitalOcean Droplet

创建 Droplet:

```bash
# 安装 Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# 配置
sudo tailscale up --advertise-exit-node

# 配置 iptables
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

## 下一步

- [子网路由器](/features/subnet-routers) - 访问本地网络
- [访问控制](/features/access-control) - 配置 ACL
- [高可用性](/features/high-availability) - 设置冗余