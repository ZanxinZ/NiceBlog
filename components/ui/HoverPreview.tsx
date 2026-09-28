"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { withBase } from "@/lib/base";

const WIDTH = 400;
const HEIGHT = WIDTH * (10 / 16);
const GAP = 12;
const MARGIN = 16;

// 鼠标悬停缩略图时，在旁边浮出一张大图预览。
// 用 fixed 定位渲染到 body，避免被列表的 overflow-hidden 裁掉；只响应鼠标，触屏点击不弹出。
export default function HoverPreview({ src, alt = "", children }: { src?: string; alt?: string; children: React.ReactNode }) {
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  // 滚动时位置会失效，直接收起。
  useEffect(() => {
    if (!pos) return;
    const hide = () => setPos(null);
    window.addEventListener("scroll", hide, { passive: true, once: true });
    return () => window.removeEventListener("scroll", hide);
  }, [pos]);

  if (!src) return <>{children}</>;

  function show(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    // 默认放在右侧，右边放不下就放左侧；垂直方向以缩略图为中心，并限制在视口内。
    const right = r.right + GAP;
    const left = right + WIDTH + MARGIN <= window.innerWidth ? right : Math.max(MARGIN, r.left - GAP - WIDTH);
    const top = Math.min(Math.max(MARGIN, r.top + r.height / 2 - HEIGHT / 2), window.innerHeight - HEIGHT - MARGIN);
    setPos({ left, top });
  }

  return (
    <div onPointerEnter={show} onPointerLeave={() => setPos(null)} className="shrink-0">
      {children}
      {pos &&
        createPortal(
          <div
            aria-hidden
            className="hover-preview pointer-events-none fixed z-50 overflow-hidden rounded-[18px] bg-surface p-1.5 shadow-2xl ring-1 ring-edge"
            style={{ left: pos.left, top: pos.top, width: WIDTH }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBase(src)} alt={alt} className="aspect-[16/10] w-full rounded-[12px] object-cover" />
          </div>,
          document.body,
        )}
    </div>
  );
}
