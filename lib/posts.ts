import path from "node:path";
import { CONTENT_DIR, dateStr, findMdx, listMdx, readMdx, str, stripExt, strList } from "./content";

export const categories = {
  tech: "Technical",
  life: "Lifestyle",
} as const;

export type Category = keyof typeof categories;

export type PostMeta = {
  slug: string;
  category: Category;
  title: string;
  description: string;
  date: string;
  tags: string[];
  cover: string;
  draft: boolean;
};

export type Post = PostMeta & { content: string };

const BLOG_DIR = path.join(CONTENT_DIR, "blog");

export function isCategory(value: string): value is Category {
  return value in categories;
}

function readPost(category: Category, file: string): Post {
  const { data, content } = readMdx(file);
  return {
    slug: stripExt(path.basename(file)),
    category,
    title: str(data.title, path.basename(file)),
    description: str(data.description),
    date: dateStr(data.date),
    tags: strList(data.tags),
    cover: str(data.cover),
    draft: Boolean(data.draft),
    content,
  };
}

export function getPosts(category?: Category): PostMeta[] {
  const cats = category ? [category] : (Object.keys(categories) as Category[]);

  return cats
    .flatMap((cat) => listMdx(path.join(BLOG_DIR, cat)).map((f) => readPost(cat, path.join(BLOG_DIR, cat, f))))
    .filter((p) => !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ content: _content, ...meta }) => meta);
}

export function getPost(category: Category, slug: string): Post | null {
  const file = findMdx(path.join(BLOG_DIR, category, slug));
  return file ? readPost(category, file) : null;
}
