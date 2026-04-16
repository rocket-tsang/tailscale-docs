# 子网路由器

子网路由器允许您的 tailnet 设备访问本地网络中的其他设备,即使这些设备没有安装 Tailscale。

## 什么是子网路由器?

子网路由器是一个运行 Tailscale 的设备,它将本地网络子网广播到 tailnet,使其他 tailnet 设备可以访问该子网内的所有设备。

### 工作原理

```
Tailnet 设备 ────► 子网路由器 ────► 本地网络设备
    │                  │                  │
    │                  │                  │
100.x.x.x         100.x.x.x          192.168.1.x
```

### 使用场景

- 访问家庭网络中的设备(NAS、打印机等)
- 访问办公室网络资源
- 访问云服务器的私有子网
- 连接 IoT 设备

## 设置子网路由器

### 第一步:选择路由器设备

选择一个设备作为子网路由器:

- 运行 Linux 的服务器
- Raspberry Pi
- 云服务器
- 路由器(如果支持 Tailscale)

### 第二步:安装 Tailscale

在路由器设备上安装 Tailscale:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```

### 第三步:广播子网

使用 `--advertise-routes` 选项:

```bash
# 广播单个子网
sudo tailscale up --advertise-routes=192.168.1.0/24

# 广播多个子网
sudo tailscale up --advertise-routes=192.168.1.0/24,10.0.0.0/8
```

### 第四步:批准路由器

在管理控制台批准子网路由器:

1. 登录 [Tailscale 管理控制台](https://login.tailscale.com/admin/machines)
2. 找到路由器设备
3. 点击"..."菜单
4. 选择"Approve routes"

### 第五步:验证连接

在其他设备上测试:

```bash
# Ping 子网设备
ping 192.168.1.100

# 连接到子网服务
ssh user@192.168.1.100
```

## 高级配置

### 多个子网路由器

可以设置多个子网路由器提供冗余:

```bash
# 在设备 A 上
sudo tailscale up --advertise-routes=192.168.1.0/24

# 在设备 B 上
sudo tailscale up --advertise-routes=192.168.1.0/24
```

Tailscale 会自动选择可用的路由器。

### 高可用性(HA)

设置高可用子网路由器:

```bash
# 所有路由器都使用相同的子网广告
tailscale up --advertise-routes=192.168.1.0/24
```

特性:

- 自动故障转移
- 负载均衡
- 无需额外配置

### IPv6 子网

广播 IPv6 子网:

```bash
sudo tailscale up --advertise-routes=fd00::/8
```

### 限制子网访问

使用 ACL 限制谁可以访问子网:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["group:admins"],
      "dst": ["192.168.1.0/24:*"]
    },
    {
      "action": "accept",
      "src": ["group:developers"],
      "dst": ["192.168.1.100:80"]
    }
  ]
}
```

## 客户端配置

### 自动接收路由

默认情况下,客户端会自动接收已批准的子网路由。

### 手动接收路由

如果需要手动接收特定路由:

```bash
tailscale up --accept-routes
```

### 查看路由状态

```bash
tailscale status
```

输出会显示子网路由:

```
100.100.100.100  subnet-router  alice@example.com  linux -
                 subnet: 192.168.1.0/24
```

### 查看路由表

```bash
tailscale routes
```

## Linux 上的高级配置

### IP forwarding

启用 IP forwarding:

```bash
# 临时启用
sudo sysctl -w net.ipv4.ip_forward=1
sudo sysctl -w net.ipv6.conf.all.forwarding=1

# 永久启用
echo 'net.ipv4.ip_forward=1' | sudo tee -a /etc/sysctl.conf
echo 'net.ipv6.conf.all.forwarding=1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### iptables 配置

如果使用 iptables,可能需要配置 NAT:

```bash
# 启用 MASQUERADE
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

### 防火墙配置

确保防火墙允许转发:

```bash
# UFW
sudo ufw allow forwarding

# firewalld
sudo firewall-cmd --add-forward
```

## 示例场景

### 家庭网络访问

设置 Raspberry Pi 作为子网路由器:

```bash
# 在 Raspberry Pi 上
sudo tailscale up --advertise-routes=192.168.0.0/24
```

访问家庭 NAS:

```bash
# 在远程设备上
ssh user@192.168.0.100
```

### 云服务器私有子网

访问 AWS VPC 私有子网:

```bash
# 在 VPC 内的 EC2 实例上
sudo tailscale up --advertise-routes=10.0.1.0/24
```

访问私有数据库:

```bash
# 从 tailnet 设备访问
mysql -h 10.0.1.50 -u user -p
```

### 办公室网络

访问办公室打印机:

```bash
# 在办公室服务器上
sudo tailscale up --advertise-routes=172.16.0.0/12
```

使用打印机:

```bash
# 配置打印机 IP
lpadmin -p Printer -v 172.16.1.100
```

## 故障排除

### 无法访问子网设备

检查步骤:

1. 确认子网路由已批准
2. 确认客户端接受路由
3. 确认 IP forwarding 已启用
4. 检查防火墙设置
5. Ping 子网路由器设备

### 路由器不显示子网

可能原因:

- 子网未正确广告
- 路由器未在管理控制台批准
- ACL 限制访问

检查:

```bash
tailscale status
```

### 性能问题

优化建议:

- 使用高性能设备作为路由器
- 确保良好的网络连接
- 考虑多个路由器分担负载
- 检查防火墙规则

### 冲突路由

如果多个路由器广告相同的子网:

- Tailscale 会自动选择一个
- 可以手动指定使用哪个路由器
- 使用 ACL 控制优先级

## 最佳实践

### 1. 选择合适的位置

子网路由器应该:

- 位于子网内部
- 有稳定的连接
- 有足够的性能

### 2. 设置冗余

多个子网路由器提供:

- 高可用性
- 负载均衡
- 故障恢复

### 3. 使用 ACL

限制访问提高安全性:

```json
{
  "acls": [
    {
      "action": "accept",
      "src": ["group:authorized"],
      "dst": ["192.168.1.0/24:*"]
    }
  ]
}
```

### 4. 监控状态

定期检查路由器状态:

```bash
tailscale status
tailscale ping subnet-router
```

### 5. 文档化

记录:

- 子网路由器位置
- 广播的子网范围
- ACL 配置
- IP 地址分配

## 下一步

- [出口节点](/features/exit-nodes) - 路由所有流量
- [访问控制](/features/access-control) - 配置 ACL
- [高可用性](/features/high-availability) - 设置 HA