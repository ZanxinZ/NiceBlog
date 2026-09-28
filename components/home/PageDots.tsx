"use client";

import { useEffect, useState } from "react";

// 门户首页右侧的页码指示器：显示当前在第几页，点击跳转。
export default function PageDots({ pages }: { pages: { id: string; label: string }[] }) {
  const [active, setActive] = useState(pages[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    pages.forEach((p) => {
      const el = document.getElementById(p.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pages]);

  return (
    <nav aria-label="首页分页" className="neu-raised-sm fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-1 rounded-full p-1.5 lg:flex">
      {pages.map((p) => {
        const current = active === p.id;
        return (
          <a
            key={p.id}
            href={`#${p.id}`}
            aria-current={current ? "true" : undefined}
            className={`flex h-11 w-11 items-center justify-center rounded-full text-[12px] font-medium transition-[color,box-shadow] duration-200 ${
              current ? "bg-accent-soft text-accent" : "text-muted hover:text-ink-strong"
            }`}
          >
            {p.label}
          </a>
        );
      })}
    </nav>
  );
}
