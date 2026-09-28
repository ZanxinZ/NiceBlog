"use client";

import { useEffect, useRef, useState } from "react";
import { CaretDown, CaretLeft, ListBullets, PushPin } from "@phosphor-icons/react";
import { useActiveHeading } from "@/components/useActiveHeading";
import type { Heading } from "@/lib/content";

type Mode = "auto" | "pinned" | "closed";

const STORAGE_KEY = "post-toc-mode";
const SETTLE_MS = 600;

// 文章目录栏，悬浮贴在视口左侧：
// - 自动模式（默认）：滚动时收到左侧屏幕外，停止滚动约 0.6s 后展开；
// - 手动点「收起」后一直收着，直到点左边缘的把手；
// - 点把手展开后为常开（滚动也不收起）；图钉可在常开 / 自动之间切换；模式会记住。
// 移动端改为正文上方的折叠目录。
export default function PostToc({ headings }: { headings: Heading[] }) {
  const [mode, setMode] = useState<Mode>("auto");
  const [scrolling, setScrolling] = useState(false);
  const [active, select] = useActiveHeading(headings);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "pinned" || saved === "closed") setMode(saved);
    } catch {}
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolling(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setScrolling(false), SETTLE_MS);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer.current);
    };
  }, []);

  function persist(next: Mode) {
    setMode(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }

  const open = mode === "pinned" || (mode === "auto" && !scrolling);

  const links = (
    <ul className="grid gap-0.5">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={() => select(h.id)}
            aria-current={active === h.id ? "location" : undefined}
            className={`flex min-h-9 items-center rounded-xl py-1.5 pr-3 text-[14px] leading-snug transition-colors ${h.depth === 3 ? "pl-6" : "pl-3"} ${
              active === h.id ? "bg-accent-soft font-medium text-accent" : "text-muted hover:text-ink-strong"
            }`}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* 移动端：正文上方的折叠目录 */}
      <details className="flat-panel group mb-6 rounded-[20px] lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-5 text-[15px] font-medium text-ink-strong">
          目录
          <CaretDown size={14} weight="bold" className="text-muted transition-transform group-open:rotate-180" />
        </summary>
        <nav className="px-2 pb-3">{links}</nav>
      </details>

      {/* 桌面端：悬浮贴左的目录栏 */}
      <nav
        aria-label="文章目录"
        aria-hidden={!open}
        inert={!open}
        className={`flat-panel fixed left-4 top-[84px] z-30 hidden max-h-[calc(100dvh-100px)] w-fit min-w-[12rem] max-w-[17rem] overflow-y-auto rounded-[24px] p-2 shadow-[0_6px_20px_rgba(40,48,60,0.05)] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block ${
          open ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-[calc(100%+24px)] opacity-0"
        }`}
      >
        <div className="flex items-center justify-between gap-2 pl-3">
          <span className="text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">目录</span>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => persist(mode === "pinned" ? "auto" : "pinned")}
              aria-pressed={mode === "pinned"}
              aria-label={mode === "pinned" ? "取消常开" : "常开"}
              title={mode === "pinned" ? "取消常开（滚动时自动收起）" : "常开（滚动时不收起）"}
              className={`flex size-9 items-center justify-center rounded-xl transition-colors ${
                mode === "pinned" ? "text-accent" : "text-muted hover:text-ink-strong"
              }`}
            >
              <PushPin size={16} weight={mode === "pinned" ? "fill" : "bold"} />
            </button>
            <button
              type="button"
              onClick={() => persist("closed")}
              aria-label="收起目录"
              title="收起目录"
              className="flex size-9 items-center justify-center rounded-xl text-muted transition-colors hover:text-ink-strong"
            >
              <CaretLeft size={16} weight="bold" />
            </button>
          </div>
        </div>
        <div className="mt-1">{links}</div>
      </nav>

      {/* 收起时贴在左边缘的把手 */}
      <button
        type="button"
        onClick={() => persist("pinned")}
        aria-label="展开目录"
        title="展开目录"
        tabIndex={open ? -1 : 0}
        className={`flat-panel fixed left-0 top-[84px] z-30 hidden h-12 w-9 items-center justify-center rounded-r-2xl border-l-0 text-muted shadow-[0_6px_20px_rgba(40,48,60,0.05)] transition-[transform,opacity,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-accent lg:flex ${
          open ? "pointer-events-none -translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <ListBullets size={18} weight="bold" />
      </button>
    </>
  );
}
