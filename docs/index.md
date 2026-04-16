---
layout: home

hero:
  name: Tailscale
  text: 中文文档
  tagline: 零信任身份连接平台
  image:
    src: /logo.svg
    alt: Tailscale
  actions:
    - theme: brand
      text: 快速开始
      link: /getting-started/quickstart
    - theme: alt
      text: 安装指南
      link: /install/

features:
  - icon: 🔒
    title: 零信任安全
    details: 基于身份的访问控制,替代传统 VPN、SASE 和 PAM
  - icon: 🌐
    title: 全球连接
    details: 连接远程团队、多云环境、CI/CD 流水线、边缘设备和 AI 工作负载
  - icon: 🚀
    title: 简单易用
    details: 基于 WireGuard® 协议,自动配置,无需管理复杂的证书和网络设置
  - icon: 🔧
    title: 灵活集成
    details: 支持各种平台和系统集成,包括 Kubernetes、Docker、云服务等
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}
</style>