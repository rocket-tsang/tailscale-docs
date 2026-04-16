# 在 Kubernetes 中安装 Tailscale

Tailscale Kubernetes Operator 可以将 Kubernetes 集群和服务接入 tailnet，实现安全的零信任访问。

## 使用场景

- 通过 tailnet 安全访问集群内的 Service
- 将 Pod 所在子网暴露给 tailnet
- 替代 Ingress，通过 Tailscale 提供私有访问入口
- 在多集群之间建立安全连接

## 前提条件

- Kubernetes 1.20+
- `kubectl` 和 `helm` 已安装并配置好集群访问
- Tailscale 账号，且具有管理员权限
- 已生成 OAuth Client（用于 Operator 自动管理设备）

## 安装 Operator

### 第一步：创建 OAuth Client

1. 访问 [Tailscale 管理控制台](https://login.tailscale.com/admin/settings/oauth)
2. 点击 **Generate OAuth client**
3. 授予 `devices` 读写权限
4. 保存 Client ID 和 Client Secret

### 第二步：添加 Helm 仓库

```bash
helm repo add tailscale https://pkgs.tailscale.com/helmcharts
helm repo update
```

### 第三步：安装 Operator

```bash
helm upgrade \
  --install \
  tailscale-operator \
  tailscale/tailscale-operator \
  --namespace tailscale \
  --create-namespace \
  --set-string oauth.clientId="<CLIENT_ID>" \
  --set-string oauth.clientSecret="<CLIENT_SECRET>" \
  --wait
```

验证安装：

```bash
kubectl get pods -n tailscale
```

## 将 Service 暴露到 tailnet

为 Service 添加注解，即可自动创建一个 Tailscale 代理节点：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  annotations:
    tailscale.com/expose: "true"           # 开启 Tailscale 代理
    tailscale.com/hostname: "my-service"  # 在 tailnet 中的节点名（可选）
spec:
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
```

应用后，`my-service` 会出现在 tailnet 中，可通过 MagicDNS 访问：

```bash
curl http://my-service
```

## Ingress 模式

使用 Tailscale 作为 Ingress Controller，为集群创建私有访问入口：

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    kubernetes.io/ingress.class: tailscale
spec:
  rules:
    - host: my-app      # tailnet 内的主机名
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-service
                port:
                  number: 80
  tls:
    - hosts:
        - my-app       # 自动获取 Tailscale 证书
```

## 子网路由器模式

将集群 Pod CIDR 或 Service CIDR 广播到 tailnet，使 tailnet 设备可直接访问集群内 IP：

```yaml
apiVersion: tailscale.com/v1alpha1
kind: Connector
metadata:
  name: cluster-connector
spec:
  hostname: k8s-connector
  subnetRouter:
    advertiseRoutes:
      - "10.96.0.0/12"    # Service CIDR
      - "10.244.0.0/16"   # Pod CIDR
```

::: warning 注意
广播集群内部 CIDR 前，请确认与现有 tailnet 路由不冲突。
:::

## 使用 ProxyGroup 实现高可用

ProxyGroup 可以创建多个代理副本，提高可用性：

```yaml
apiVersion: tailscale.com/v1alpha1
kind: ProxyGroup
metadata:
  name: my-proxygroup
spec:
  type: egress
  replicas: 2
```

## 验证

查看 Tailscale 管理的资源：

```bash
# 查看 Operator 创建的 Pod
kubectl get pods -n tailscale

# 查看设备注册状态
kubectl get tailscaledevices -A
```

在另一个 tailnet 设备上测试访问：

```bash
tailscale ping my-service
curl http://my-service
```

## 卸载

```bash
helm uninstall tailscale-operator -n tailscale
kubectl delete namespace tailscale
```

## 故障排除

### Operator Pod 未启动

```bash
kubectl describe pod -n tailscale -l app=tailscale-operator
kubectl logs -n tailscale -l app=tailscale-operator
```

### Service 未出现在 tailnet

检查注解是否正确，以及 Operator 日志中是否有权限错误：

```bash
kubectl logs -n tailscale -l app=tailscale-operator | grep -i error
```

### 无法通过 MagicDNS 解析

确认 MagicDNS 已在管理控制台启用，并等待 DNS 传播（通常 1-2 分钟）。

## 下一步

- [Docker 安装](/install/docker) - 在 Docker 中使用 Tailscale
- [Kubernetes Operator 功能详解](/features/kubernetes-operator) - 更多高级配置
- [MagicDNS](/features/magicdns) - 配置集群内 DNS
