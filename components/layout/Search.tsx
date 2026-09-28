"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import Kbd from "@/components/ui/Kbd";
import { basePath } from "@/lib/base";

type Result = { url: string; title: string; excerpt: string };

type Pagefind = {
  options: (opts: { baseUrl: string }) => Promise<void>;
  init: () => void;
  debouncedSearch: (q: string) => Promise<{ results: { data: () => Promise<{ url: string; meta: { title?: string }; excerpt: string }> }[] } | null>;
};

// 索引来源：pnpm build 时由 Pagefind 读取 out/ 的 HTML 生成；pnpm dev 时由 scripts/dev-search-index.mjs 生成到 public/pagefind/。
// 用 new Function 绕过打包器，让浏览器在运行时直接加载这个文件。
const importAtRuntime = new Function("url", "return import(url)") as (url: string) => Promise<Pagefind>;

export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [status, setStatus] = useState<"idle" | "ready" | "unavailable">("idle");
  const pagefind = useRef<Pagefind | null>(null);

  const load = useCallback(async () => {
    if (pagefind.current) return;
    try {
      const mod = await importAtRuntime(`${basePath}/pagefind/pagefind.js`);
      await mod.options({ baseUrl: `${basePath}/` });
      mod.init();
      pagefind.current = mod;
      setStatus("ready");
    } catch {
      setStatus("unavailable");
    }
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  useEffect(() => {
    const pf = pagefind.current;
    if (!pf || !query.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    pf.debouncedSearch(query).then(async (search) => {
      if (!search || cancelled) return;
      const data = await Promise.all(search.results.slice(0, 8).map((r) => r.data()));
      if (!cancelled) setResults(data.map((d) => ({ url: d.url, title: d.meta.title ?? d.url, excerpt: d.excerpt })));
    });
    return () => {
      cancelled = true;
    };
  }, [query, status]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="搜索"
        className="neu-raised-sm neu-press flex size-11 items-center justify-center gap-2 rounded-full text-muted transition-colors hover:text-accent lg:w-auto lg:px-4"
      >
        <MagnifyingGlass size={18} weight="bold" />
        <span className="hidden gap-0.5 lg:flex">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-canvas/60 px-4 pt-[12vh] backdrop-blur-md" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-label="搜索"
            className="neu-raised w-full max-w-xl overflow-hidden rounded-[28px] p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flat flex items-center gap-3 rounded-full px-5">
              <MagnifyingGlass size={16} weight="bold" className="shrink-0 text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && results[0]) window.location.assign(results[0].url);
                }}
                placeholder="搜索项目、文档和文章"
                className="h-12 w-full bg-transparent text-[15px] text-ink-strong outline-none placeholder:text-muted"
              />
              <Kbd>Esc</Kbd>
            </div>
            <div className="mt-2 max-h-[60vh] overflow-y-auto p-1">
              {status === "unavailable" && (
                <p className="px-3 py-6 text-center text-sm text-muted">
                  还没有搜索索引。开发时运行 <code className="font-mono">pnpm search:dev</code> 生成后刷新页面。
                </p>
              )}
              {status === "ready" && query.trim() && results.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-muted">没有找到相关内容。</p>
              )}
              {results.map((r) => (
                <a key={r.url} href={r.url} className="block rounded-2xl px-4 py-3 transition-colors hover:bg-well">
                  <p className="text-sm font-medium text-ink-strong">{r.title}</p>
                  <p
                    className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-muted [&_mark]:bg-yellow-bg [&_mark]:text-yellow-fg"
                    dangerouslySetInnerHTML={{ __html: r.excerpt }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
