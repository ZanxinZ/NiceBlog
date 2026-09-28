"use client";

import { useRef, useState, type ComponentProps } from "react";
import { Check, Copy, X } from "@phosphor-icons/react";
import { writeClipboard } from "@/lib/clipboard";

type Status = "idle" | "copied" | "failed";

// 代码块外框：右上角的复制按钮。复制的是纯代码（行号是 CSS 生成的，不会被复制）。
export default function CodeFigure({ children, className = "", ...props }: ComponentProps<"figure">) {
  const ref = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  async function copy() {
    const text = ref.current?.querySelector("pre code")?.textContent?.replace(/\n$/, "") ?? "";
    const ok = await writeClipboard(text);
    setStatus(ok ? "copied" : "failed");
    window.setTimeout(() => setStatus("idle"), 1600);
  }

  const Icon = status === "copied" ? Check : status === "failed" ? X : Copy;

  return (
    <figure ref={ref} {...props} className={`group relative ${className}`}>
      {children}
      <button
        type="button"
        onClick={copy}
        data-pagefind-ignore
        aria-label="复制代码"
        className={`absolute right-2.5 top-2.5 flex h-8 items-center group-has-[figcaption]:top-[5px] group-has-[figcaption]:h-7 gap-1.5 rounded-lg border border-edge bg-panel px-2.5 font-sans text-[12px] font-medium opacity-70 transition-[opacity,color] hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100 ${
          status === "copied" ? "text-green-fg" : status === "failed" ? "text-red-fg" : "text-muted hover:text-ink-strong"
        }`}
      >
        <Icon size={14} weight="bold" />
        {status === "copied" ? "已复制" : status === "failed" ? "复制失败" : "复制"}
      </button>
    </figure>
  );
}
