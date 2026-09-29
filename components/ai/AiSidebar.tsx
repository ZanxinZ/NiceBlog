"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CaretDown, CaretRight, MagnifyingGlass, X } from "@phosphor-icons/react";
import type { AiItemMeta, AiKind } from "@/lib/ai";

// 左侧树状目录：分类（Prompt、Skill…）→ 分组 → 条目，每层都可折叠。
// 默认展开当前页面所在的分类和分组；输入筛选词时展开所有匹配项。
// 桌面端吸顶；移动端收进正文上方可折叠的面板。
export default function AiSidebar({ kinds }: { kinds: AiKind[] }) {
  const raw = usePathname();
  const pathname = raw.endsWith("/") ? raw : raw + "/";
  const [query, setQuery] = useState("");
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  const activeKind = kinds.find((k) => pathname.startsWith(k.href)) ?? kinds[0];
  const current = activeKind && [...activeKind.items, ...activeKind.groups.flatMap((g) => g.items)].find((i) => i.href === pathname);

  const q = query.trim().toLowerCase();
  const match = (i: AiItemMeta) => !q || [i.title, i.description, i.slug, ...i.tags].some((s) => s.toLowerCase().includes(q));

  const isOpen = (key: string, containsActive: boolean) => (q ? true : (toggled[key] ?? containsActive));
  const toggle = (key: string, containsActive: boolean) => setToggled((t) => ({ ...t, [key]: !(t[key] ?? containsActive) }));

  const tree = kinds.map((kind) => {
    const items = kind.items.filter(match);
    const groups = kind.groups.map((g) => ({ ...g, items: g.items.filter(match) })).filter((g) => g.items.length > 0);
    const count = items.length + groups.reduce((n, g) => n + g.items.length, 0);
    if (q && count === 0) return null;

    const kindActive = kind.key === activeKind?.key;
    const open = isOpen(kind.key, kindActive);
    return (
      <li key={kind.key}>
        <button
          type="button"
          onClick={() => toggle(kind.key, kindActive)}
          aria-expanded={open}
          className="flex min-h-10 w-full items-center gap-1.5 rounded-2xl px-3 text-left text-[15px] font-semibold text-ink-strong transition-colors hover:text-accent"
        >
          {open ? <CaretDown size={14} weight="bold" className="text-muted" /> : <CaretRight size={14} weight="bold" className="text-muted" />}
          <span className="flex-1">{kind.title}</span>
          <span className="font-mono text-[11px] font-normal text-muted">{count}</span>
        </button>

        {open && (
          <ul className="ml-[18px] space-y-0.5 border-l border-edge pl-2">
            {items.map((item) => (
              <ItemLink key={item.href} item={item} active={item.href === pathname} />
            ))}
            {groups.map((g) => {
              const key = `${kind.key}/${g.key}`;
              const groupActive = g.items.some((i) => i.href === pathname);
              const gOpen = isOpen(key, groupActive);
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => toggle(key, groupActive)}
                    aria-expanded={gOpen}
                    className="flex min-h-9 w-full items-center gap-1 rounded-2xl px-1 text-left text-[13px] font-medium text-muted transition-colors hover:text-ink-strong"
                  >
                    {gOpen ? <CaretDown size={12} weight="bold" /> : <CaretRight size={12} weight="bold" />}
                    <span className="flex-1">{g.title}</span>
                    <span className="pr-2 font-mono text-[11px] font-normal">{g.items.length}</span>
                  </button>
                  {gOpen && (
                    <ul className="ml-[10px] space-y-0.5 border-l border-edge pl-2">
                      {g.items.map((item) => (
                        <ItemLink key={item.href} item={item} active={item.href === pathname} />
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            {count === 0 && <li className="px-3 py-2 text-[13px] text-muted">暂无内容</li>}
          </ul>
        )}
      </li>
    );
  });

  const panel = (
    <div className="space-y-3">
      <label className="neu-inset flex h-10 items-center gap-2 rounded-full px-3.5 text-muted">
        <MagnifyingGlass size={15} weight="bold" className="shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="筛选名称或标签"
          aria-label="筛选 AI 资料"
          className="min-w-0 flex-1 bg-transparent text-[14px] text-ink-strong outline-none placeholder:text-muted"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="清除筛选" className="shrink-0 hover:text-ink-strong">
            <X size={14} weight="bold" />
          </button>
        )}
      </label>
      <nav aria-label="AI 资料目录">
        <ul className="space-y-1">{tree}</ul>
        {q && tree.every((n) => n === null) && <p className="px-3 py-6 text-center text-[13px] text-muted">没有匹配的内容</p>}
      </nav>
    </div>
  );

  return (
    <>
      <details className="neu-raised group rounded-[24px] lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 text-[15px]">
          <span className="truncate text-ink-strong">
            {activeKind?.title}
            {current && <span className="text-muted"> / {current.title}</span>}
          </span>
          <CaretDown size={14} weight="bold" className="shrink-0 text-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="p-3 pt-0">{panel}</div>
      </details>
      <aside className="hidden lg:block">
        <div className="neu-raised sticky top-[84px] max-h-[calc(100vh-100px)] overflow-y-auto rounded-[28px] p-3">{panel}</div>
      </aside>
    </>
  );
}

function ItemLink({ item, active }: { item: AiItemMeta; active: boolean }) {
  return (
    <li>
      <Link
        href={item.href}
        title={item.description || item.title}
        aria-current={active ? "page" : undefined}
        className={`flex min-h-9 items-center rounded-2xl px-3 text-[14px] transition-colors ${
          active ? "bg-accent-soft font-medium text-accent" : "text-ink hover:text-accent"
        }`}
      >
        <span className="truncate">{item.title}</span>
      </Link>
    </li>
  );
}
