import fs from "node:fs";
import path from "node:path";
import { CONTENT_DIR, findMdx, listMdx, num, readMdx, str, strList, stripExt } from "./content";

// AI 协作资料区结构：
//   content/ai/<kind>/index.mdx                                  （能力分类，如 Prompt、Skill；只用 title/order 决定名称和顺序，没有单独页面）
//   content/ai/<kind>/<slug>.mdx           → /ai/<kind>/<slug>/  （不属于任何分组，排在分组前面）
//   content/ai/<kind>/<group>/index.mdx                          （可选：分组的 title/order）
//   content/ai/<kind>/<group>/<slug>.mdx   → /ai/<kind>/<slug>/  （分组只影响左侧目录，不进网址，条目换分组时链接不变）
// 同一层内按 frontmatter 的 order 排序，其次按标题。同一分类内 slug 不能重复。

export type AiItemMeta = {
  kind: string;
  slug: string;
  href: string;
  title: string;
  description: string;
  tags: string[];
  order: number;
};

export type AiItem = AiItemMeta & { content: string };

export type AiGroup = { key: string; title: string; order: number; items: AiItemMeta[] };

export type AiKind = {
  key: string;
  href: string;
  title: string;
  order: number;
  items: AiItemMeta[];
  groups: AiGroup[];
};

const AI_DIR = path.join(CONTENT_DIR, "ai");

function readItem(file: string, kind: string): AiItem {
  const { data, content } = readMdx(file);
  const slug = stripExt(path.basename(file));
  return {
    kind,
    slug,
    href: `/ai/${kind}/${slug}/`,
    title: str(data.title, slug),
    description: str(data.description),
    tags: strList(data.tags),
    order: num(data.order, 100),
    content,
  };
}

const byOrder = (a: { order: number; title: string }, b: { order: number; title: string }) =>
  a.order - b.order || a.title.localeCompare(b.title, "zh-CN");

const subdirs = (dir: string) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

function readIndex(dir: string) {
  const file = findMdx(path.join(dir, "index"));
  return file ? readMdx(file).data : {};
}

function readItems(dir: string, kind: string): AiItemMeta[] {
  return listMdx(dir)
    .filter((f) => stripExt(f) !== "index")
    .map((f) => {
      const { content: _content, ...m } = readItem(path.join(dir, f), kind);
      return m;
    })
    .sort(byOrder);
}

export function getAiKinds(): AiKind[] {
  if (!fs.existsSync(AI_DIR)) return [];
  return subdirs(AI_DIR)
    .map((key): AiKind => {
      const dir = path.join(AI_DIR, key);
      const index = readIndex(dir);
      const groups = subdirs(dir)
        .map((g): AiGroup => {
          const data = readIndex(path.join(dir, g));
          return { key: g, title: str(data.title, g), order: num(data.order, 100), items: readItems(path.join(dir, g), key) };
        })
        .filter((g) => g.items.length > 0)
        .sort(byOrder);
      const items = readItems(dir, key);

      const seen = new Set<string>();
      for (const item of [...items, ...groups.flatMap((g) => g.items)]) {
        if (seen.has(item.slug)) throw new Error(`content/ai/${key}/ 下有重名条目：${item.slug}`);
        seen.add(item.slug);
      }

      return {
        key,
        href: `/ai/${key}/`,
        title: str(index.title, key),
        order: num(index.order, 100),
        items,
        groups,
      };
    })
    .sort(byOrder);
}

// 分类下的全部条目：先未分组的，再按分组顺序。
export const allItems = (kind: AiKind) => [...kind.items, ...kind.groups.flatMap((g) => g.items)];

export function getAiKind(kind: string): AiKind | null {
  return getAiKinds().find((k) => k.key === kind) ?? null;
}

export function getAiItem(kind: string, slug: string): AiItem | null {
  if (slug === "index") return null;
  const dir = path.join(AI_DIR, kind);
  if (!fs.existsSync(dir)) return null;
  const file = findMdx(path.join(dir, slug)) ?? subdirs(dir).map((g) => findMdx(path.join(dir, g, slug))).find(Boolean);
  return file ? readItem(file, kind) : null;
}
