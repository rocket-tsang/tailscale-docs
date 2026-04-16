# 在 Docker 中安装 Tailscale

本指南介绍如何在 Docker 容器中运行 Tailscale，适用于容器化应用的网络接入场景。

## 使用场景

- 让 Docker 容器加入 tailnet
- 通过 Tailscale 暴露容器服务
- 在 Docker Compose 环境中使用 Tailscale 作为 sidecar

## 前提条件

- 已安装 Docker（版本 20.10+）
- 拥有 Tailscale 账号
- 已生成 Auth Key（在管理控制台 → Settings → Keys）

## 方式一：直接运行容器

```bash
docker run -d \
  --name tailscale \
  --cap-add NET_ADMIN \
  --cap-add NET_RAW \
  -e TS_AUTHKEY=tskey-xxxxxxxxxxxx \
  -e TS_HOSTNAME=my-docker-node \
  -v tailscale-state:/var/lib/tailscale \
  tailscale/tailscale:latest
```

### 常用环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `TS_AUTHKEY` | 认证密钥 | `tskey-xxxxxxxxxxxx` |
| `TS_HOSTNAME` | 节点名称 | `my-docker-node` |
| `TS_ROUTES` | 广播子网路由 | `192.168.1.0/24` |
| `TS_EXTRA_ARGS` | 额外的 `tailscale up` 参数 | `--accept-dns=false` |
| `TS_STATE_DIR` | 状态目录路径 | `/var/lib/tailscale` |

## 方式二：Docker Compose Sidecar 模式

将 Tailscale 作为 sidecar 容器与应用共享网络，适合暴露单个服务到 tailnet：

```yaml
# docker-compose.yml
version: '3.8'

services:
  tailscale:
    image: tailscale/tailscale:latest
    hostname: my-app
    environment:
      - TS_AUTHKEY=tskey-xxxxxxxxxxxx
      - TS_HOSTNAME=my-app
      - TS_SERVE_CONFIG=/config/serve.json   # 可选：Funnel/Serve 配置
    volumes:
      - tailscale-state:/var/lib/tailscale
      - /dev/net/tun:/dev/net/tun
    cap_add:
      - NET_ADMIN
      - NET_RAW
    restart: unless-stopped

  app:
    image: nginx:alpine
    network_mode: "service:tailscale"   # 共享 tailscale 容器的网络栈
    depends_on:
      - tailscale

volumes:
  tailscale-state:
```

::: tip 提示
使用 `network_mode: "service:tailscale"` 后，`app` 容器会与 `tailscale` 共享同一个网络栈，无需额外端口映射即可通过 tailnet 访问。
:::

## 方式三：作为子网路由器

让 Docker 容器将宿主机所在子网广播到 tailnet：

```bash
docker run -d \
  --name tailscale \
  --cap-add NET_ADMIN \
  --cap-add NET_RAW \
  -e TS_AUTHKEY=tskey-xxxxxxxxxxxx \
  -e TS_ROUTES=192.168.1.0/24 \
  -v tailscale-state:/var/lib/tailscale \
  tailscale/tailscale:latest
```

然后在管理控制台批准路由。

## 持久化状态

Tailscale 需要持久化认证状态，推荐使用具名卷：

```bash
# 创建具名卷
docker volume create tailscale-state

# 挂载至容器
-v tailscale-state:/var/lib/tailscale
```

::: warning 注意
如果不持久化状态，每次容器重启都需要重新认证，会在管理控制台产生新的设备条目。
:::

## 使用 Ephemeral 密钥

对于无状态部署（如 CI/CD），建议使用 Ephemeral Auth Key：

1. 在管理控制台创建密钥时勾选 **Ephemeral**
2. 容器退出后节点会自动从 tailnet 中移除

```bash
docker run --rm \
  --cap-add NET_ADMIN \
  --cap-add NET_RAW \
  -e TS_AUTHKEY=tskey-auth-xxxxxxxxxxxx \   # Ephemeral 密钥
  tailscale/tailscale:latest
```

## 验证连接

进入容器查看状态：

```bash
docker exec tailscale tailscale status
```

测试连通性：

```bash
docker exec tailscale tailscale ping other-node
```

## 故障排除

### 容器无法启动

检查是否有 `NET_ADMIN` 权限：

```bash
docker inspect tailscale | grep -i cap
```

### 状态丢失

确认卷挂载正确：

```bash
docker volume inspect tailscale-state
```

### 看不到其他节点

检查认证密钥是否过期，或在管理控制台确认设备是否已授权。

## 下一步

- [Kubernetes Operator](/install/kubernetes) - 在 Kubernetes 中使用 Tailscale
- [出口节点](/features/exit-nodes) - 将容器设为出口节点
- [子网路由器](/features/subnet-routers) - 广播容器网络
