# Cloud 服务器安装

在云服务器上安装 Tailscale,包括 AWS、GCP、Azure 等平台。

## 通用安装步骤

所有云平台使用相同的安装方法:

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscaled
sudo tailscale up
```

## platform-Specific Instructions

### AWS EC2

#### Ubuntu/Debian

```bash
# 更新系统
sudo apt-get update && sudo apt-get upgrade -y

# 安装 Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# 启动服务
sudo systemctl enable tailscaled
sudo systemctl start tailscaled

# 连接到网络
sudo tailscale up
```

#### Amazon Linux 2

```bash
# 更新系统
sudo yum update -y

# 安装 Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# 启动服务
sudo systemctl enable tailscaled
sudo systemctl start tailscaled

# 连接到网络
sudo tailscale up
```

### Google Cloud Platform

#### Debian/Ubuntu

```bash
sudo apt-get update
sudo apt-get install tailscale
sudo systemctl enable tailscaled
sudo systemctl start tailscaled
sudo tailscale up
```

### Azure

#### Ubuntu

```bash
sudo apt-get update
curl -fsSL https://tailscale.com/install.sh | sh
sudo systemctl enable tailscaled
sudo systemctl start tailscaled
sudo tailscale up
```

## 云平台最佳实践

### AWS

1. **安全组配置**:
   - 允许 UDP 端口 41641
   - 或使用 Tailscale 作为出口节点

2. **实例配置**:
   - 启用元数据服务
   - 配置适当的角色和权限

### GCP

1. **防火墙规则**:
   - 允许 Tailscale 流量
   - 或使用子网路由器

2. **IAM 角色**:
   - 配置适当的服务账户

### Azure

1. **网络安全组**:
   - 允许 UDP 41641
   - 配置路由表

## 自动化部署

### Cloud Init

```yaml
#cloud-config
packages:
  - tailscale

runcmd:
  - systemctl enable tailscaled
  - systemctl start tailscaled
  - tailscale up --authkey ${TAILSCALE_AUTH_KEY}
```

### Terraform

```hcl
resource "aws_instance" "example" {
  ami           = "ami-0123456789"
  instance_type = "t3.micro"
  
  user_data = <<EOF
#!/bin/bash
curl -fsSL https://tailscale.com/install.sh | sh
systemctl enable tailscaled
systemctl start tailscaled
tailscale up --authkey ${tailscale_auth_key}
EOF
}
```

## 监控和日志

```bash
# 查看服务状态
systemctl status tailscaled

# 查看日志
journalctl -u tailscaled -f

# 查看连接状态
tailscale status
```

## 故障排除

### 服务无法启动

```bash
# 检查端口
sudo netstat -tulpn | grep 41641

# 查看日志
journalctl -u tailscaled -n 100
```

### 无法连接到网络

```bash
# 检查 DNS
systemctl status systemd-resolved

# 重启网络
sudo systemctl restart systemd-resolved
```
