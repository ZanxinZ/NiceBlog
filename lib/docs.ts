import fs from "node:fs";
import path from "node:path";
import { CONTENT_DIR, findMdx, listMdx, num, readMdx, str, stripExt } from "./content";

// 文档结构：
//   content/docs/index.mdx              → /docs/
//   content/docs/<page>.mdx             → /docs/<page>/        （归入「开始」分组）
//   content/docs/<group>/index.mdx      → /docs/<group>/       （分组概述，title/order 决定分组名和顺序）
//   content/docs/<group>/<page>.mdx     → /docs/<group>/<page>/
// 同组内按 frontmatter 的 order 排序，其次按标题。

export type DocMeta = {
  slug: string[];
  href: string;
  title: string;
  description: string;
  order: number;
};

export type Doc = DocMeta & { content: string };

export type DocGroup = {
  key: string;
  title: string;
  description: string;
  href: string | null;
  order: number;
  pages: DocMeta[];
};

const DOCS_DIR = path.join(CONTENT_DIR, "docs");

function readDoc(file: string, slug: string[]): Doc {
  const { data, content } = readMdx(file);
  return {
    slug,
    href: `/docs/${slug.map((s) => s + "/").join("")}`,
    title: str(data.title, slug.at(-1) ?? "文档"),
    description: str(data.description),
    order: num(data.order, 100),
    content,
  };
}

const byOrder = (a: DocMeta, b: DocMeta) => a.order - b.order || a.title.localeCompare(b.title, "zh-CN");

const meta = ({ content: _content, ...m }: Doc): DocMeta => m;

export function getDocTree(): DocGroup[] {
  if (!fs.existsSync(DOCS_DIR)) return [];

  const rootIndex = findMdx(path.join(DOCS_DIR, "index"));
  const rootPages = listMdx(DOCS_DIR)
    .filter((f) => stripExt(f) !== "index")
    .map((f) => meta(readDoc(path.join(DOCS_DIR, f), [stripExt(f)])))
    .sort(byOrder);

  const start: DocGroup = {
    key: "",
    title: "开始",
    description: "",
    href: null,
    order: -1,
    pages: [...(rootIndex ? [meta(readDoc(rootIndex, []))] : []), ...rootPages],
  };

  const groups = fs
    .readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d): DocGroup => {
      const dir = path.join(DOCS_DIR, d.name);
      const indexFile = findMdx(path.join(dir, "index"));
      const index = indexFile ? readDoc(indexFile, [d.name]) : null;
      const pages = listMdx(dir)
        .filter((f) => stripExt(f) !== "index")
        .map((f) => meta(readDoc(path.join(dir, f), [d.name, stripExt(f)])))
        .sort(byOrder);
      return {
        key: d.name,
        title: index?.title ?? d.name,
        description: index?.description ?? "",
        href: index?.href ?? null,
        order: index?.order ?? 100,
        pages,
      };
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "zh-CN"));

  return [start, ...groups].filter((g) => g.pages.length > 0 || g.href);
}

// 阅读顺序：用于生成静态路由和上一篇 / 下一篇。
export function getDocsInOrder(): DocMeta[] {
  return getDocTree().flatMap((g) => {
    const index = g.href && g.key ? [{ slug: [g.key], href: g.href, title: g.title, description: g.description, order: g.order }] : [];
    return [...index, ...g.pages];
  });
}

export function getDoc(slug: string[]): Doc | null {
  const base = path.join(DOCS_DIR, ...slug);
  const file = findMdx(base) ?? findMdx(path.join(base, "index"));
  return file ? readDoc(file, slug) : null;
}
