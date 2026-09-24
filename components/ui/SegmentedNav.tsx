"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";

type Pill = { x: number; w: number; visible: boolean };

// HIG 分段控件（链接版）：凹陷的轨道 + 一个会滑动的选中胶囊。
// - 胶囊是独立的一层，activeIndex 变化时用 transform 滑到新选项（带轻微回弹）；
// - 首次渲染、从「无选中」进入时直接定位，不从别处滑过来；
// - 要有滑动效果，组件需要在切换时保持挂载（放在 layout 里，而不是每个 page 各渲染一份）。
export default function SegmentedNav({
  items,
  activeIndex,
  label,
  className = "",
}: {
  items: { href: string; label: string }[];
  activeIndex: number;
  label?: string;
  className?: string;
}) {
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pill, setPill] = useState<Pill>({ x: 0, w: 0, visible: false });
  const [armed, setArmed] = useState(false);

  useLayoutEffect(() => {
    function measure() {
      const el = itemRefs.current[activeIndex];
      setPill((prev) => (el ? { x: el.offsetLeft, w: el.offsetWidth, visible: true } : { ...prev, visible: false }));
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (navRef.current) ro.observe(navRef.current);
    return () => ro.disconnect();
  }, [activeIndex]);

  // 胶囊出现后的下一帧才开启过渡，之后在各项之间切换都会滑动。
  useEffect(() => {
    if (!pill.visible) {
      setArmed(false);
      return;
    }
    const id = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(id);
  }, [pill.visible]);

  return (
    <nav ref={navRef} aria-label={label} className={`neu-inset relative inline-flex items-center gap-1 rounded-full p-1 ${className}`}>
      <span
        aria-hidden
        className={`absolute bottom-1 left-0 top-1 rounded-full bg-well ring-1 ring-edge ${
          armed ? "transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:transition-none" : ""
        }`}
        style={{ transform: `translateX(${pill.x}px)`, width: pill.w, opacity: pill.visible ? 1 : 0 }}
      />
      {items.map((item, i) => {
        const active = i === activeIndex;
        return (
          <Link
            key={item.href}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`relative flex h-9 items-center rounded-full px-4 text-[14px] font-medium transition-colors duration-300 ${
              active ? "text-accent" : "text-muted hover:text-ink-strong"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
