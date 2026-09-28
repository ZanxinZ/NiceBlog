"use client";

import { useEffect, useRef, useState } from "react";
import { Check, FilePdf, LinkSimple, ShareNetwork } from "@phosphor-icons/react";

// 分享菜单：复制当前页链接，或调起浏览器打印另存为 PDF（打印样式见 globals.css）。
export default function ShareButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1200);
    } catch {
      setOpen(false);
    }
  }

  function savePdf() {
    setOpen(false);
    // 等菜单收起后再打印，避免菜单出现在 PDF 里。
    requestAnimationFrame(() => window.print());
  }

  const item = "flex min-h-11 w-full items-center gap-3 rounded-2xl px-4 text-left text-[15px] text-ink transition-colors hover:bg-well";

  return (
    <div ref={ref} className="relative shrink-0 print:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="分享"
        aria-haspopup="menu"
        aria-expanded={open}
        className="neu-raised-sm neu-press flex h-11 items-center gap-2 rounded-full px-4 text-[15px] font-medium text-muted transition-colors hover:text-accent"
      >
        <ShareNetwork size={18} weight="bold" />
        <span className="hidden sm:inline">分享</span>
      </button>

      {open && (
        <div role="menu" className="neu-raised absolute right-0 top-full z-30 mt-3 w-48 rounded-[22px] p-2">
          <button type="button" role="menuitem" onClick={copyLink} className={item}>
            {copied ? <Check size={18} weight="bold" className="text-accent" /> : <LinkSimple size={18} weight="bold" className="text-muted" />}
            {copied ? "已复制" : "复制链接"}
          </button>
          <button type="button" role="menuitem" onClick={savePdf} className={item}>
            <FilePdf size={18} weight="bold" className="text-muted" />
            下载 PDF
          </button>
        </div>
      )}
    </div>
  );
}
