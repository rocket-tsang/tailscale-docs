# Kubernetes Operator

Tailscale Kubernetes Operator 允许将 Kubernetes 集群暴露到 Tailscale 网络中。这是一个强大的集成工具,使 Kubernetes 服务能够通过 Tailscale 访问。

## 什么是 Kubernetes Operator?

Tailscale Kubernetes Operator 是一个自定义控制器:

- 管理 Kubernetes 到 Tailscale 的连接
- 自动化 Tailscale 设备部署
- 支持流量入站和出站
- 提供多集群连接能力

Operator 可用于[所有计划](/pricing)。

## 功能

### API Server 代理

通过 API server 代理访问 Kubernetes 控制平面:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server-proxy
spec:
  template:
    spec:
      containers:
      - name: proxy
        image: tailscale/k8s-operator
```

### 集群出口(egress)

将 tailnet 服务暴露到 Kubernetes 集群:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-egress
spec:
  type: ClusterIP
  ports:
  - port: 80
```

### 集群入口(ingress)

将集群工作负载暴露到 tailnet:

```yaml
apiVersion: tailscale.com/v1alpha1
kind: Ingress
metadata:
  name: example-ingress
spec:
  service: example-service
```

### 跨集群连接

在不同 Kubernetes 集群之间建立连接:

```yaml
apiVersion: tailscale.com/v1alpha1
kind: ProxyGroup
metadata:
  name: cross-cluster
spec:
  type: ingress
  replicas: 3
```

### 云服务暴露

将云服务暴露到 tailnet:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: cloud-service
  annotations:
    tailscale.com/expose: "true"
spec:
  ports:
  - port: 443
```

### 出口节点和子网路由器

部署 exit node 和 subnet router:

```yaml
apiVersion: tailscale.com/v1alpha1
kind: Connector
metadata:
  name: exit-node
spec:
  type: exit-node
```

### App Connector

部署 app connector:

```yaml
apiVersion: tailscale.com/v1alpha1
kind: Connector
metadata:
  name: app-connector
spec:
  type: app-connector
```

### TSRecorder

部署(tsrecorder)用于会话记录:

```yaml
apiVersion: tailscale.com/v1alpha1
kind: Recorder
metadata:
  name: session-recorder
spec:
  enabled: true
```

### 多集群入口

将多集群应用暴露给内部用户:

```yaml
apiVersion: tailscale.com/v1alpha1
kind: Ingress
metadata:
  name: multi-cluster
spec:
  multipleClusters: true
```

### ArgoCD 多集群管理

使用 ArgoCD 管理多集群部署:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: multi-cluster
spec:
  source:
    repoURL: https://github.com/example/multi-cluster
```

## 安装

### 先决条件

需要[OAuth 客户端凭证](/features/oauth-clients#setting-up-an-oauth-client)来管理设备。

1. 在 tailnet 策略文件中创建标签:

```json
{
  "tagOwners": {
    "tag:k8s-operator": [],
    "tag:k8s": ["tag:k8s-operator"]
  }
}
```

2. 在管理控制台创建 OAuth 客户端:

-Devices Core
-Auth Keys
-Services
-tags:tag:k8s-operator

### Helm 安装

1. 添加 Helm 仓库:

```bash
helm repo add tailscale https://pkgs.tailscale.com/helmcharts
helm repo update
```

2. 安装 operator:

```bash
helm upgrade \
  --install \
  tailscale-operator \
  tailscale/tailscale-operator \
  --namespace=tailscale \
  --create-namespace \
  --set-string oauth.clientId="<OAuth client ID>" \
  --set-string oauth.clientSecret="<OAuth client secret>" \
  --wait
```

### 静态清单安装

1. 下载[manifest 文件](https://github.com/tailscale/tailscale/blob/main/cmd/k8s-operator/deploy/manifests/operator.yaml)

2. 编辑文件,设置 OAuth 凭据:

```yaml
env:
- name: TS_OAUTH_CLIENT_ID
  value: "k123456CNTRL"
- name: TS_OAUTH_CLIENT_SECRET
  value: "tskey-client-k123456CNTRL-abcdef"
```

3. 应用到集群:

```bash
kubectl apply -f manifest.yaml
```

### 工作负载身份联合

支持使用 Kubernetes ServiceAccount 令牌进行身份验证:

```bash
# 获取集群发行者
ISSUER="$(kubectl get --raw /.well-known/openid-configuration | jq '.issuer')"

# 配置联合身份
# Issuer: 自定义发卡机构
# Subject: system:serviceaccount:tailscale:operator
# Scopes: Devices Core, Auth Keys, Services
```

## 验证

验证 Operator 已加入 tailnet:

1. 在管理控制台的 [Machines](https://login.tailscale.com/admin/machines) 页面
2. 查找名为 `tailscale-operator` 的节点
3. 确认标记为 `tag:k8s-operator`

```bash
# 检查 Pod 状态
kubectl get pods -n tailscale

# 查看日志
kubectl logs -n tailscale deploy/operator
```

## 高级配置

### 预创建 ProxyGroup

对于生产环境,建议预创建多副本 ProxyGroup:

```yaml
apiVersion: tailscale.com/v1alpha1
kind: ProxyGroup
metadata:
  name: ts-proxies
spec:
  type: egress
  replicas: 3
```

这避免了单点故障和升级时的停机时间。

### 标签选择器

查找 PxoyGroup 创建的 StatefulSet:

```bash
kubectl get statefulset \
  --namespace tailscale \
  --selector="tailscale.com/managed=true,tailscale.com/parent-resource-type=ingress,tailscale.com/parent-resource=ts-ingress"
```

## 版本支持

### Operator 和代理版本

- 推荐使用相同版本
- 支持最多低 4 个版本的代理
- 不支持高于 Operator 版本的代理

### Kubernetes 版本

- 最低支持版本: v1.23.0
- 测试版本: v1.23.0 - v1.28.0

## CNI 兼容性

Operator 仅在 Proxy Pod 的网络命名空间中配置自定义路由,与大多数 CNI 配置兼容。

### Cilium kube-proxy 替代模式

如果使用 Cilium 的 kube-proxy 替代模式,需要启用 Pod 命名空间中的套接字负载均衡旁路。

## TLS 证书和续订

- 自动为 Tailscale Ingress 和 API server proxy 服务提供 TLS 证书
- 证书有效期: 90 天
- 通常在三分之二期间续订
- 仅在服务有流量时续订

## 限制

- 无内置仪表板或指标
- 容器镜像和图表未签名(正在开发中)
- 静态清单仅来自 tailscale/tailscale 代码库
- 不支持 OpenShift

## 故障排除

参考 [Tailscale Troubleshooting](/reference/troubleshooting/containers/kubernetes-operator) 获取详细的故障排除指南。

### 常见问题

1. Operator 无法加入 tailnet
   - 检查 OAuth 凭据
   - 验证标签配置
   - 查看日志获取错误

2. Proxy 无法创建
   - 检查 RBAC 权限
   - 验证命名空间配置
   - 确认 Tailscale API 访问

3. 服务无法暴露
   - 检查 Service 配置
   - 验证 Ingress 资源
   - 查看 operator 日志

## 最佳实践

### 1. 使用 Helm

使用 Helm 管理部署,便于升级和回滚。

### 2. 预创建 ProxyGroup

生产环境使用多副本 ProxyGroup 提高可用性。

### 3. 监控

- 监控 Operator Pod 状态
- 检查 Proxy 创建状态
- 查看日志获取问题

### 4. 版本管理

- 保持 Operator 和代理版本一致
- 定期更新
- 在测试环境验证

### 5. 安全

- 保护 OAuth 密钥
- 使用最小权限
- 定期轮换密钥

## 示例配置

### 完整的 Ingress 配置

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-app
spec:
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 3000

---
apiVersion: tailscale.com/v1alpha1
kind: Ingress
metadata:
  name: web-app-ingress
spec:
  service: web-app
  hostname: web-app.example.ts.net
```

### ProxyGroup 配置

```yaml
apiVersion: tailscale.com/v1alpha1
kind: ProxyGroup
metadata:
  name: prod-gateway
spec:
  type: ingress
  replicas: 3
  nodeTags:
    - tag:prod
```

## 扩展阅读

- [Tailscale 服务](/features/tailscale-services) - Tailscale 服务
- [访问控制](/features/access-control) - ACL 配置
- [标签](/features/tags) - 标签系统

## 下一步

- [服务](/features/services) - 服务端点
- [访问控制](/features/access-control) - ACL 管理
- [Kubernetes 文档](/kubernetes) - Kubernetes 集成指南
