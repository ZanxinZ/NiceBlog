// 站点基础信息：名字、简介、链接、首页各区块的内容都在这里。
export const site = {
  name: "Zanxin",
  title: "iOS / Web Engineer",
  role: "iOS Developer",
  intro: "iOS App 开发",
  email: "zanxinz@outlook.com",
  github: "https://github.com/zanxinz",
  // 头像：放到 public/images/ 后填写路径，例如 "/images/avatar.jpg"；留空时显示名字首字母。
  avatar: "",

  // 关于页「能力」区块，icon 可选：mobile / web / architecture / tooling
  capabilities: [
    { icon: "mobile", title: "iOS 工程", body: "Swift 与 SwiftUI，从 0 到 1 的业务模块，以及 UIKit 老项目的渐进迁移。" },
    { icon: "architecture", title: "客户端架构", body: "导航、状态与模块边界的设计，让团队在同一套约定下协作。" },
    { icon: "web", title: "Web 与混合方案", body: "WKWebView 容器里 Native 与 Web 的通信协议。" },
  ],
  
  stack: ["Swift", "SwiftUI", "UIKit", "Combine", "Python", "Vibe-Coding Web"],

  now: ["整理 iOS 架构笔记，陆续发到文档区", "🏋️健身记录软件"],

  experience: [
    {
      period: "2023 — 至今",
      role: "Senior iOS Engineer",
      org: "Company A",
      summary: "负责 App 整体架构，推动 SwiftUI 迁移。",
      highlights: ["负责 App 整体架构，推动 SwiftUI 迁移", "设计 WKWebView 混合容器，统一 Native / Web 通信"],
    },
    {
      period: "2020 — 2023",
      role: "iOS Engineer",
      org: "Company B",
      summary: "从 0 到 1 搭建核心业务模块。",
      highlights: ["从 0 到 1 搭建核心业务模块"],
    },
  ],
} as const;

export const nav = [
  { href: "/blog/", label: "Blog" },
  { href: "/projects/", label: "Project" },
  { href: "/about/", label: "About", also: ["/docs/"] },
] as const;
