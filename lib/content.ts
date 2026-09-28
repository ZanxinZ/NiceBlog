import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// blog / docs / projects 共用的 MDX 读取工具。

export const CONTENT_DIR = path.join(process.cwd(), "content");

export type Frontmatter = Record<string, unknown>;

export function readMdx(file: string): { data: Frontmatter; content: string } {
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { data, content };
}

export function listMdx(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f));
}

export function findMdx(basePathWithoutExt: string): string | null {
  for (const ext of [".mdx", ".md"]) {
    if (fs.existsSync(basePathWithoutExt + ext)) return basePathWithoutExt + ext;
  }
  return null;
}

export const stripExt = (file: string) => file.replace(/\.mdx?$/, "");

export const str = (v: unknown, fallback = "") => (v == null ? fallback : String(v));

export const strList = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);

export const num = (v: unknown, fallback = 0) => (typeof v === "number" ? v : Number(v ?? fallback) || fallback);

export function dateStr(v: unknown) {
  return v instanceof Date ? v.toISOString().slice(0, 10) : str(v);
}

// 标题锚点：保留中英文和数字，空白转成连字符。Markdown 渲染和目录提取共用。
export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

export type Heading = { depth: 2 | 3; text: string; id: string };

// 从 MDX 源码提取 h2 / h3，跳过代码块。
export function extractHeadings(source: string): Heading[] {
  const headings: Heading[] = [];
  let inFence = false;
  for (const line of source.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = /^(##|###)\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[2]
      .replace(/`([^`]*)`/g, "$1")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_]/g, "");
    headings.push({ depth: m[1].length as 2 | 3, text, id: slugify(text) });
  }
  return headings;
}
