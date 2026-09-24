"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Heading } from "@/lib/content";

// 标题滚到顶部导航下方这条线以内，就算进入该章节（顶栏 68px + 锚点留白）。
const OFFSET = 100;

// 目录高亮：当前章节 = 已经滚过 OFFSET 的最后一个标题。
// - 滚到页面底部时，最后几个标题可能到不了顶部，改取屏幕内可见的最后一个；
// - 点击目录项时直接高亮被点的那项，直到用户下一次手动滚动（滚轮 / 触摸 / 键盘）。
export function useActiveHeading(headings: Heading[]) {
  const [active, setActive] = useState(headings[0]?.id);
  const locked = useRef(false);

  useEffect(() => {
    let frame = 0;

    function compute() {
      frame = 0;
      if (locked.current) return;
      const els = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => el !== null);
      if (els.length === 0) return;

      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= OFFSET) current = el.id;
        else break;
      }

      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        const visible = els.filter((el) => el.getBoundingClientRect().top < window.innerHeight);
        if (visible.length) current = visible[visible.length - 1].id;
      }

      setActive(current);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(compute);
    }

    function unlock() {
      locked.current = false;
    }

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("wheel", unlock, { passive: true });
    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("keydown", unlock);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("wheel", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [headings]);

  // 目录项的点击处理：立即高亮并锁定，避免跳转过程中高亮来回跳。
  const select = useCallback((id: string) => {
    locked.current = true;
    setActive(id);
  }, []);

  return [active, select] as const;
}
