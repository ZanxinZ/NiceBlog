# NiceBlog

个人主页：项目展示 + 文档（博客）+ 技术笔记。Next.js 静态导出，MDX 写内容，Pagefind 全站搜索，GitHub Pages 自动发布。

## 日常操作

| 要做什么 | 改哪里 |
| --- | --- |
| 名字 / 头像 / 简介 / 关于页各区块 / 联系方式 | `lib/site.ts` |
| 新增项目 | `content/projects/xxx.mdx` |
| 新增文档 | `content/docs/<分组>/xxx.mdx`（分组目录里放 `index.mdx` 作为概述） |
| 新增技术文章 | `content/blog/engineering/xxx.mdx` |
| 新增产品文章 | `content/blog/product/xxx.mdx` |
| 新增生活文章 | `content/blog/life/xxx.mdx` |
| 图片 / 封面 | `public/images/`，文中或 frontmatter 的 `cover` 用 `/images/xxx.png` |
| MDX 可用组件 | `components/mdx/Markdown.tsx` |
| 颜色 / 字体等设计 token | `app/globals.css` |

各类内容的 frontmatter 字段见站内文档「本站指南 → 新增内容」（`content/docs/site/writing.mdx`）。

提交到 `main` 后 GitHub Actions 自动构建并发布，几分钟后上线。

## 目录结构

```
app/                 路由（首页、projects、docs、blog、about）
components/
  ui/                新拟物基础组件：Card、Button、ImageFrame、Avatar、Tag、Reveal…
  layout/            Header、Footer、搜索
  docs/              文档侧栏、本页目录、上一篇 / 下一篇
  mdx/               MDX 渲染和可在正文中使用的组件
  home/              首页组件：门户分页、头条文章、个人卡片
content/             所有内容（MDX）
lib/                 内容读取、站点配置、basePath 工具
```

## 本地 / Codespaces 预览

```bash
pnpm install
pnpm dev      # http://localhost:3000（启动前自动生成搜索索引）
pnpm search:dev  # 开发时新增 / 修改内容后，更新搜索索引
pnpm build    # 生成 out/ 并建立搜索索引
pnpm start    # 预览 out/，包含搜索
```
