"use client";

import { useActiveHeading } from "@/components/useActiveHeading";
import type { Heading } from "@/lib/content";

// 本页目录：高亮当前阅读到的标题。
export default function Toc({ headings }: { headings: Heading[] }) {
  const [active, select] = useActiveHeading(headings);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="本页目录" className="text-sm">
      <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">本页目录</p>
      <ul className="mt-3 space-y-1.5 border-l border-line-strong">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={() => select(h.id)}
              aria-current={active === h.id ? "location" : undefined}
              className={`-ml-px block border-l py-0.5 transition-colors ${h.depth === 3 ? "pl-6" : "pl-4"} ${
                active === h.id ? "border-accent text-accent" : "border-transparent text-muted hover:text-ink-strong"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
