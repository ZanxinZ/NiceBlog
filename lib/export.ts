import path from "node:path";
import { getAiItem } from "./ai";
import { getDoc } from "./docs";
import { getPost, isCategory, type Post } from "./posts";

// 文章「复制全文 / 导出文件」用到的数据，构建时生成。
//
// 导出时从当前文章出发，递归收集正文里引用的站内文章 / 文档，按引用关系组成目录树：
//   <slug>/index.md
//   <slug>/images/…            本篇用到的图片（含封面）
//   <slug>/<child>/index.md    被本篇引用的文章，继续向下递归
// 同一篇只导出一次；再次被引用时，链接指向它第一次出现的位置。

export type ExportFile = { path: string } & ({ text: string } | { url: string });

export type ExportBundle = {
  name: string;
  // 「仅复制文本」：本篇的 Markdown，不含图片，站内链接保持 / 开头，由浏览器补全域名。
  text: string;
  files: ExportFile[];
};

export type ExportSource = { href: string; slug: string; title: string; description: string; cover: string; content: string };

type Node = ExportSource;

function fromPost(post: Post): Node {
  return {
    href: `/blog/${post.category}/${post.slug}/`,
    slug: post.slug,
    title: post.title,
    description: post.description,
    cover: post.cover,
    content: post.content,
  };
}

// 站内链接 → 文章 / 文档 / AI 资料；其他页面（项目、关于页等）不展开。
function resolve(href: string): Node | null {
  const parts = href.split(/[?#]/)[0].split("/").filter(Boolean);
  if (parts[0] === "blog" && parts.length === 3 && isCategory(parts[1])) {
    const post = getPost(parts[1], parts[2]);
    return post && !post.draft ? fromPost(post) : null;
  }
  if (parts[0] === "docs") {
    const doc = getDoc(parts.slice(1));
    return doc && { href: doc.href, slug: doc.slug.at(-1) ?? "docs", title: doc.title, description: doc.description, cover: "", content: doc.content };
  }
  if (parts[0] === "ai" && parts.length === 3) {
    const item = getAiItem(parts[1], parts[2]);
    return item && { href: item.href, slug: item.slug, title: item.title, description: item.description, cover: "", content: item.content };
  }
  return null;
}

const hashOf = (href: string) => /#.*$/.exec(href)?.[0] ?? "";

// 把正文拆成代码块 / 非代码块，链接改写和组件转换只作用于非代码块。
function mapProse(source: string, fn: (prose: string) => string) {
  const out: string[] = [];
  let buf: string[] = [];
  let inFence = false;
  const flush = () => {
    if (buf.length) out.push(inFence ? buf.join("\n") : fn(buf.join("\n")));
    buf = [];
  };
  for (const line of source.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      if (!inFence) flush();
      buf.push(line);
      if (inFence) flush();
      inFence = !inFence;
      continue;
    }
    buf.push(line);
  }
  flush();
  return out.join("\n");
}

const calloutLabel: Record<string, string> = { tip: "提示", warn: "注意" };

// MDX 组件转成普通 Markdown，方便在其他编辑器里阅读。
function toMarkdown(prose: string) {
  return prose
    .replace(/<Callout(?:\s+type="(\w+)")?\s*>\s*([\s\S]*?)\s*<\/Callout>/g, (_, type: string | undefined, body: string) =>
      [`> **${calloutLabel[type ?? "tip"] ?? "提示"}**`, ">", ...body.split("\n").map((l) => `> ${l.trim()}`.trimEnd())].join("\n"),
    )
    .replace(/<Kbd>([\s\S]*?)<\/Kbd>/g, "`$1`");
}

const LINK = /(!?)\[([^\]]*)\]\(\s*([^)\s]+)((?:\s+"[^"]*")?)\s*\)/g;
const IMG_TAG = /(<img\b[^>]*\bsrc=")([^"]+)(")/g;

const isSitePath = (href: string) => href.startsWith("/") && !href.startsWith("//");

function header(node: Node, cover: string | null) {
  return [`# ${node.title}`, node.description && `> ${node.description}`, cover && `![${node.title}](${cover})`].filter(Boolean).join("\n\n");
}

export function buildExport(post: Post): ExportBundle {
  return buildExportFrom(fromPost(post));
}

export function buildExportFrom(root: ExportSource): ExportBundle {
  const files: ExportFile[] = [];
  const placed = new Map<string, string>([[root.href, root.slug]]);

  function walk(node: Node, dir: string) {
    const images = new Map<string, string>();
    const usedNames = new Set<string>();
    const localImage = (src: string) => {
      if (!isSitePath(src)) return src;
      let name = images.get(src);
      if (!name) {
        const base = path.posix.basename(src.split(/[?#]/)[0]);
        name = base;
        for (let i = 2; usedNames.has(name); i++) name = base.replace(/(\.[^.]*)?$/, `-${i}$1`);
        usedNames.add(name);
        images.set(src, name);
        files.push({ path: `${dir}/images/${name}`, url: src });
      }
      return `images/${name}`;
    };

    // 先登记子节点的位置，再改写链接，保证兄弟之间互相引用时路径一致。
    const children: [Node, string][] = [];
    mapProse(node.content, (prose) => {
      for (const [, bang, , href] of prose.matchAll(LINK)) {
        if (bang || !isSitePath(href)) continue;
        const target = resolve(href);
        if (!target || placed.has(target.href)) continue;
        const childDir = `${dir}/${target.slug}`;
        placed.set(target.href, childDir);
        children.push([target, childDir]);
      }
      return prose;
    });

    const relLink = (href: string) => {
      const target = isSitePath(href) ? resolve(href) : null;
      const at = target && placed.get(target.href);
      return at ? `${path.posix.relative(dir, at) || "."}/index.md${hashOf(href)}` : href;
    };

    const body = mapProse(node.content, (prose) =>
      toMarkdown(prose)
        .replace(LINK, (_, bang: string, text: string, href: string, title: string) => `${bang}[${text}](${bang ? localImage(href) : relLink(href)}${title})`)
        .replace(IMG_TAG, (_, a: string, src: string, b: string) => a + localImage(src) + b),
    );

    const cover = node.cover ? localImage(node.cover) : null;
    files.push({ path: `${dir}/index.md`, text: `${header(node, cover)}\n\n${body.trim()}\n` });

    for (const [child, childDir] of children) walk(child, childDir);
  }

  walk(root, root.slug);

  const text = mapProse(root.content, (prose) =>
    toMarkdown(prose)
      .replace(/^\s*!\[[^\]]*\]\([^)]*\)\s*$/gm, "")
      .replace(/<img\b[^>]*>/g, "")
      .replace(/\n{3,}/g, "\n\n"),
  );

  return { name: root.slug, text: `${header(root, null)}\n\n${text.trim()}\n`, files };
}
