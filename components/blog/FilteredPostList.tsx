"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PostList from "@/components/PostList";
import type { PostMeta } from "@/lib/posts";

// 文章列表 + tag 筛选。选中的 tag 记在网址的 ?tag= 里，可以分享、前进后退。
// 静态导出时服务端拿不到查询参数，所以先渲染完整列表，到浏览器里再按 tag 过滤。
export default function FilteredPostList({ posts }: { posts: PostMeta[] }) {
  return (
    <Suspense fallback={<Filtered posts={posts} active={null} />}>
      <WithSearchParams posts={posts} />
    </Suspense>
  );
}

function WithSearchParams({ posts }: { posts: PostMeta[] }) {
  const tag = useSearchParams().get("tag");
  return <Filtered posts={posts} active={tag} />;
}

function Filtered({ posts, active }: { posts: PostMeta[]; active: string | null }) {
  const router = useRouter();
  const pathname = usePathname();

  // 按出现次数从多到少，次数相同时按名字排序。
  const counts = new Map<string, number>();
  for (const p of posts) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  const tags = [...counts.keys()].sort((a, b) => counts.get(b)! - counts.get(a)! || a.localeCompare(b));

  // 网址里的 tag 在当前分类下不存在时，当作没选。
  const current = active && counts.has(active) ? active : null;
  const shown = current ? posts.filter((p) => p.tags.includes(current)) : posts;

  function select(tag: string | null) {
    router.replace(tag ? `${pathname}?tag=${encodeURIComponent(tag)}` : pathname, { scroll: false });
  }

  return (
    <>
      {tags.length > 0 && (
        <div role="group" aria-label="按标签筛选" className="mb-4 flex flex-wrap gap-2">
          <Chip active={current === null} onClick={() => select(null)}>
            全部
          </Chip>
          {tags.map((t) => (
            <Chip key={t} active={current === t} onClick={() => select(current === t ? null : t)}>
              {t}
              <span className="ml-1 font-mono opacity-60">{counts.get(t)}</span>
            </Chip>
          ))}
        </div>
      )}
      <PostList posts={shown} />
    </>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex h-8 items-center rounded-full px-3 text-[13px] font-medium transition-colors ${
        active ? "bg-accent text-on-accent" : "bg-subtle text-muted hover:text-ink-strong"
      }`}
    >
      {children}
    </button>
  );
}
