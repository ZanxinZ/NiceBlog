"use client";

import { useEffect, useRef, useState } from "react";
import { Check, CircleNotch, Copy, FileArchive, TextAlignLeft, X } from "@phosphor-icons/react";
import { basePath, withBase } from "@/lib/base";
import { writeClipboard } from "@/lib/clipboard";
import type { ExportBundle } from "@/lib/export";
import { zip } from "@/lib/zip";

type Status = "idle" | "working" | "done" | "failed";

// 文章标题右侧的「复制全文」菜单：仅复制文本（Markdown，不含图片），或导出文件（含引用文章和图片的 zip）。
export default function CopyArticleButton({ bundle }: { bundle: ExportBundle }) {
  const [open, setOpen] = useState(false);
  const [copy, setCopy] = useState<Status>("idle");
  const [exp, setExp] = useState<Status>("idle");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function settle(set: (s: Status) => void, ok: boolean) {
    set(ok ? "done" : "failed");
    setTimeout(() => {
      set("idle");
      if (ok) setOpen(false);
    }, 1400);
  }

  async function copyText() {
    // 站内链接补全为完整地址，粘贴到别处也能打开。
    const origin = window.location.origin + basePath;
    const text = bundle.text.replace(/\]\(\/(?!\/)/g, `](${origin}/`);
    settle(setCopy, await writeClipboard(text));
  }

  async function exportFiles() {
    if (exp === "working") return;
    setExp("working");
    try {
      const enc = new TextEncoder();
      const entries = await Promise.all(
        bundle.files.map(async (f) => {
          if ("text" in f) return { path: f.path, data: enc.encode(f.text) };
          const res = await fetch(withBase(f.url));
          if (!res.ok) throw new Error(`${res.status} ${f.url}`);
          return { path: f.path, data: new Uint8Array(await res.arrayBuffer()) };
        }),
      );
      const url = URL.createObjectURL(zip(entries));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${bundle.name}.zip`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      settle(setExp, true);
    } catch (err) {
      console.error("导出失败", err);
      settle(setExp, false);
    }
  }

  const item = "flex min-h-11 w-full items-center gap-3 rounded-2xl px-4 text-left text-[15px] text-ink transition-colors hover:bg-well";
  const icon = (s: Status, Idle: typeof Copy) =>
    s === "working" ? (
      <CircleNotch size={18} weight="bold" className="animate-spin text-muted" />
    ) : s === "done" ? (
      <Check size={18} weight="bold" className="text-accent" />
    ) : s === "failed" ? (
      <X size={18} weight="bold" className="text-red-fg" />
    ) : (
      <Idle size={18} weight="bold" className="text-muted" />
    );

  return (
    <div ref={ref} data-pagefind-ignore className="relative shrink-0 print:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="复制全文"
        aria-haspopup="menu"
        aria-expanded={open}
        className="neu-raised-sm neu-press flex h-11 items-center gap-2 rounded-full px-4 text-[15px] font-medium text-muted transition-colors hover:text-accent"
      >
        <Copy size={18} weight="bold" />
        <span className="hidden sm:inline">复制全文</span>
      </button>

      {open && (
        <div role="menu" className="neu-raised absolute right-0 top-full z-30 mt-3 w-48 rounded-[22px] p-2">
          <button type="button" role="menuitem" onClick={copyText} className={item}>
            {icon(copy, TextAlignLeft)}
            {copy === "done" ? "已复制" : copy === "failed" ? "复制失败" : "仅复制文本"}
          </button>
          <button type="button" role="menuitem" onClick={exportFiles} disabled={exp === "working"} className={item}>
            {icon(exp, FileArchive)}
            {exp === "working" ? "导出中…" : exp === "done" ? "已导出" : exp === "failed" ? "导出失败" : "导出文件"}
          </button>
        </div>
      )}
    </div>
  );
}
