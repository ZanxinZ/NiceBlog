// 开发模式用的搜索索引。
// 正式构建时 Pagefind 读取 out/ 里的 HTML 建索引（见 package.json 的 build），开发服务器读不到它；
// 这个脚本直接读取 content/ 下的 MDX，用 Pagefind 的 Node API 生成索引到 public/pagefind/，
// 让 pnpm dev 时 ⌘K 搜索也能用。新增或修改内容后，重新运行 pnpm search:dev 即可更新。
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import * as pagefind from "pagefind";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const OUTPUT = path.join(ROOT, "public", "pagefind");

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : /\.mdx?$/.test(d.name) ? [p] : [];
  });
}

// MDX → 纯文本：去掉 JSX 标签、Markdown 标记，保留代码内容以便搜索 API 名称。
function toText(source) {
  return source
    .replace(/^\s*(import|export)\s.*$/gm, "")
    .replace(/<\/?[A-Za-z][^>]*>/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^```.*$/gm, "")
    .replace(/[`*_>#|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function urlFor(file) {
  const rel = path.relative(CONTENT, file).replace(/\\/g, "/").replace(/\.mdx?$/, "");
  const [type, ...rest] = rel.split("/");
  if (type === "docs") {
    const parts = rest.at(-1) === "index" ? rest.slice(0, -1) : rest;
    return `/docs/${parts.map((p) => p + "/").join("")}`;
  }
  return `/${type === "projects" ? "projects" : "blog"}/${rest.join("/")}/`;
}

const files = ["blog", "docs", "projects"].flatMap((d) => walk(path.join(CONTENT, d)));

const { index, errors } = await pagefind.createIndex({ forceLanguage: "zh-cn" });
if (!index) throw new Error(`Pagefind 初始化失败：${errors?.join("; ")}`);

let count = 0;
for (const file of files) {
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  if (data.draft) continue;
  const title = String(data.title ?? path.basename(file));
  const summary = String(data.description ?? data.summary ?? "");
  const res = await index.addCustomRecord({
    url: urlFor(file),
    // 标题也写进正文，否则只出现在标题里的词搜不到
    content: `${title} ${summary} ${toText(content)}`,
    language: "zh-cn",
    meta: { title },
  });
  if (res.errors?.length) console.warn(file, res.errors);
  else count++;
}

fs.rmSync(OUTPUT, { recursive: true, force: true });
await index.writeFiles({ outputPath: OUTPUT });

// writeFiles 返回时文件可能还没落盘，直接 close 会把它们截断成 0 字节，
// 所以等所有文件都有内容（且大小不再变化）再关闭 Pagefind 进程。
async function waitForFlush(dir, timeoutMs = 10000) {
  const sizes = () =>
    fs.readdirSync(dir, { recursive: true, withFileTypes: true })
      .filter((d) => d.isFile() && !d.name.endsWith(".css"))
      .map((d) => fs.statSync(path.join(d.parentPath, d.name)).size);
  const start = Date.now();
  let last = "";
  while (Date.now() - start < timeoutMs) {
    const now = sizes();
    const key = now.join(",");
    if (now.length && now.every((n) => n > 0) && key === last) return;
    last = key;
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error("搜索索引写入超时：public/pagefind/ 里有空文件");
}
await waitForFlush(OUTPUT);
await pagefind.close();
console.log(`dev 搜索索引：${count} 篇内容 → public/pagefind/`);
