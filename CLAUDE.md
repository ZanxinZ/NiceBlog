# NiceBlog 内容规范

内容都放在 `content/` 下，用 MDX 写，文件开头是 frontmatter。字段的读取逻辑在 `lib/posts.ts`、`lib/docs.ts`、`lib/projects.ts`，站内说明见 `content/docs/site/writing.mdx`。

## 所有内容都要遵守的规则

- **文件名就是网址**：`swiftui-navigation.mdx` 的地址是 `/…/swiftui-navigation/`。建议用小写英文加连字符。已经发布的文件改名后，旧链接会失效。
- **标题层级**：正文从 `##` 开始写。右侧「本页目录」只收录 `##` 和 `###`，代码块里的 `#` 不会算进去。锚点由标题文字生成，所以改标题会让指向这个锚点的链接失效。
- **图片**：放在 `public/images/` 下，写成 `/images/xxx.png` 这样以 `/` 开头的路径。部署到子路径时，网站会自动补上前缀，不用手动加 basePath。
- **链接**：站内链接写 `/docs/site/` 这种以 `/` 开头、以 `/` 结尾的路径（网站开了 `trailingSlash`）。外部链接会自动在新标签页打开。
- **正文里能用的组件**：只有 `<Callout type="tip|warn">`、`<Kbd>`，以及 ` ```mermaid ` 代码块。代码块可以加 `title="xx.swift"`，也可以用 `{2-3}` 高亮某几行。想用新组件，要先在 `components/mdx/Markdown.tsx` 里注册。
- **搜索索引**：本地开发时新增或修改内容后，运行 `pnpm search:dev`，搜索才能搜到新内容。
- **发布**：推送到 `main` 后会自动构建并发布。

## 1. 文章（`content/blog/engineering/`、`content/blog/product/` 或 `content/blog/life/`）

```yaml
---
title: 标题
description: 摘要              # 显示在列表和首页上
date: 2026-09-23              # 必须写成 YYYY-MM-DD，排序按字符串比较
tags: [SwiftUI]
cover: /images/blog/xxx.png   # 可选
draft: false                  # 设为 true 时，列表里不显示，详情页返回 404
---
```

- 分类由所在目录决定，不要在 frontmatter 里写 `category`。只有三个分类：
  - `engineering`（技术）：所有技术文章，通用技术和特定平台（iOS 等）都放这里。
  - `product`（产品）：产品思维、独立开发、设计决策。
  - `life`（生活）。
- 不要为具体技术新建分类。具体的技术或主题（如 `iOS`、`SwiftUI`、`Notion`、`AI`）写在 `tags` 里，文章列表支持按 tag 筛选。tag 的写法要保持一致（比如统一写 `iOS`，不要混用 `ios`），分类名本身不用再写成 tag。
- 首页的头条总是日期最新的那篇文章，所以写日期时要注意这一点。

## 2. 文档（`content/docs/`）

```yaml
---
title: 标题
description: 一句话说明解决什么问题
order: 1          # 同组内越小越靠前，不写时默认是 100
---
```

- `content/docs/<分组>/xxx.mdx` 放进对应分组。直接放在 `docs/` 根目录下的文件，会归入「开始」分组。
- 新建分组时，要在分组目录里放一个 `index.mdx`。它的 `title` 是侧栏里的分组名，`order` 决定分组的顺序，正文是这个分组的概述页。
- 文档不支持 `draft`，文件放进去就会发布。
- 文档是持续修订的内容，这一点和文章不同：文档没有日期，保持内容最新就行。

## 3. 项目（`content/projects/`）

```yaml
---
title: 项目名
summary: 一两句话介绍
year: "2026"            # 要加引号，写成字符串
role: 设计与开发
status: 已上线           # 显示为标签
tone: green             # neutral / red / blue / green / yellow，写别的值会变成 neutral
stack: [Swift, SwiftUI]
links:
  - label: App Store
    href: https://...
featured: true          # true 时会出现在首页
order: 1                # 越小越靠前，第一个项目在网格里占大格
cover: /images/projects/xxx.png   # 可选，建议 16:10
previewTitle: content/  # 可选，预览窗口的标题
preview: |              # 可选，没有 cover 时显示在详情页窗口框里的文本
  ...
draft: false
---
```

- 排序规则：先按 `order` 从小到大，`order` 相同时按 `year` 从新到旧。

## 4. 不在 `content/` 里的内容

名字、头像、简介、关于页的各个区块、联系方式都在 `lib/site.ts` 里改。颜色和字体在 `app/globals.css` 里改。

# 格式审查
你可以检查文章格式，如果可以优化排版则你直接优化，但注意不要修改内容和本意。

# 图片
文章写完后，根据内容生成一张扁平化的图片作为封面，简洁的摘要，目的不是大而全，而是精简，让人一看知道大概文章讲什么，图片不要太大。
图片风格可以任选一个或是你自我发挥
- 极简抽象
- Mini Architecture / Diagram
- 产品截图 / UI 展示

# Git 操作相关
git 操作之前，必须经过我授权的同意，除非我明确已经说明要git操作。
commit 时，可以根据更改内容书写提交的message，如果内容太少就不需要。
