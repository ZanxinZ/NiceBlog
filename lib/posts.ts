import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

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
  draft: boolean;
};

export type Post = PostMeta & { content: string };

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export function isCategory(value: string): value is Category {
  return value in categories;
}

function readPost(category: Category, file: string): Post {
  const raw = fs.readFileSync(path.join(BLOG_DIR, category, file), "utf8");
  const { data, content } = matter(raw);
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? "");

  return {
    slug: file.replace(/\.mdx?$/, ""),
    category,
    title: String(data.title ?? file),
    description: String(data.description ?? ""),
    date,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft),
    content,
  };
}

export function getPosts(category?: Category): PostMeta[] {
  const cats = category ? [category] : (Object.keys(categories) as Category[]);

  return cats
    .flatMap((cat) => {
      const dir = path.join(BLOG_DIR, cat);
      if (!fs.existsSync(dir)) return [];
      return fs
        .readdirSync(dir)
        .filter((f) => /\.mdx?$/.test(f))
        .map((f) => readPost(cat, f));
    })
    .filter((p) => !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ content: _content, ...meta }) => meta);
}

export function getPost(category: Category, slug: string): Post | null {
  for (const ext of [".mdx", ".md"]) {
    const file = slug + ext;
    if (fs.existsSync(path.join(BLOG_DIR, category, file))) return readPost(category, file);
  }
  return null;
}
