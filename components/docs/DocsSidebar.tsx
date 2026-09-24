"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CaretDown, CaretLeft } from "@phosphor-icons/react";
import type { DocGroup } from "@/lib/docs";

// 桌面端：左侧吸顶目录。移动端：正文上方可折叠的目录。
export default function DocsSidebar({ tree }: { tree: DocGroup[] }) {
  const raw = usePathname();
  const pathname = raw.endsWith("/") ? raw : raw + "/";
  const current = tree.flatMap((g) => [...(g.href ? [{ href: g.href, title: g.title }] : []), ...g.pages]).find((p) => p.href === pathname);

  const list = (
    <nav className="space-y-6 text-[15px]">
      <Link href="/about/" className="inline-flex min-h-11 items-center gap-1 px-3 font-medium text-accent">
        <CaretLeft size={14} weight="bold" />
        关于
      </Link>
      {tree.map((g) => (
        <div key={g.key || "start"}>
          {g.href ? (
            <SidebarLink href={g.href} active={pathname === g.href} className="text-[13px] font-semibold uppercase tracking-[0.06em]">
              {g.title}
            </SidebarLink>
          ) : (
            <p className="px-3 py-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">{g.title}</p>
          )}
          <ul className="mt-1 space-y-0.5">
            {g.pages.map((p) => (
              <li key={p.href}>
                <SidebarLink href={p.href} active={pathname === p.href}>
                  {p.title}
                </SidebarLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <details className="neu-raised group rounded-[24px] lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-5 text-[15px]">
          <span className="text-ink-strong">{current?.title ?? "文档目录"}</span>
          <CaretDown size={14} weight="bold" className="text-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="p-3 pt-0">{list}</div>
      </details>
      <aside className="hidden lg:block">
        <div className="neu-raised sticky top-[84px] max-h-[calc(100vh-100px)] overflow-y-auto rounded-[28px] p-3">{list}</div>
      </aside>
    </>
  );
}

function SidebarLink({ href, active, className = "", children }: { href: string; active: boolean; className?: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-10 items-center rounded-2xl px-3 transition-[color,box-shadow] ${
        active ? "bg-accent-soft text-accent" : "text-ink hover:text-accent"
      } ${className}`}
    >
      {children}
    </Link>
  );
}
