# NiceBlog

个人主页 + 技术博客 + 生活博客。Next.js 静态导出，MDX 写内容，GitHub Pages 自动发布。

## 日常操作

| 要做什么 | 改哪里 |
| --- | --- |
| 新增技术文章 | `content/blog/tech/xxx.mdx` |
| 新增生活文章 | `content/blog/life/xxx.mdx` |
| 名字 / 简介 / 联系方式 | `lib/site.ts` |
| 首页（Now / 经历 / 技术栈） | `app/page.tsx` |
| 完整履历 | `app/about/page.tsx` |
| 图片 | `public/images/`，文中用 `/images/xxx.png` |
| MDX 可用组件 | `components/Markdown.tsx` |

提交到 `main` 后 GitHub Actions 自动构建并发布，几分钟后上线。

## 文章格式

```md
---
title: 标题
description: 摘要
date: 2026-09-23
tags:
  - SwiftUI
draft: false   # 可选，true 时不发布
---

正文……
```

文件名即 URL：`content/blog/tech/foo.mdx` → `/blog/tech/foo/`。

## 本地 / Codespaces 预览

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # 生成 out/
```
