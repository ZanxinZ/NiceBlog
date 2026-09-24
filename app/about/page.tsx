import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

// 履历直接写在这里，改完提交即可上线。
export default function About() {
  return (
    <article className="prose prose-neutral max-w-none py-12 dark:prose-invert prose-headings:tracking-tight">
      <h1>About</h1>
      <p>
        你好，我是 {site.name}。一名专注于 iOS 与 Web 的软件工程师，喜欢把复杂的东西做简单。
      </p>

      <h2>工作经历</h2>
      <h3>Senior iOS Engineer · Company A（2023 — 至今）</h3>
      <ul>
        <li>负责 App 整体架构，推动 SwiftUI 迁移</li>
        <li>设计 WKWebView 混合容器，统一 Native / Web 通信</li>
      </ul>
      <h3>iOS Engineer · Company B（2020 — 2023）</h3>
      <ul>
        <li>从 0 到 1 搭建核心业务模块</li>
      </ul>

      <h2>技术栈</h2>
      <ul>
        <li><strong>iOS：</strong>Swift、SwiftUI、UIKit、Combine</li>
        <li><strong>Web：</strong>TypeScript、React、Next.js</li>
        <li><strong>工具：</strong>Git、GitHub Actions、Xcode</li>
      </ul>

      <h2>代表项目</h2>
      <ul>
        <li><strong>Project One</strong> — 一句话描述项目和你的贡献。</li>
        <li><strong>Project Two</strong> — 一句话描述项目和你的贡献。</li>
      </ul>

      <h2>当前关注</h2>
      <p>SwiftUI 架构、跨端方案、开发者工具。</p>

      <h2>联系</h2>
      <p>
        <a href={`mailto:${site.email}`}>{site.email}</a> · <a href={site.github}>GitHub</a>
      </p>
    </article>
  );
}
