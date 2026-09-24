import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import ImageFrame from "@/components/ui/ImageFrame";
import { categories } from "@/lib/categories";
import type { PostMeta } from "@/lib/posts";

// HIG 分组列表：外层是一张新拟物卡片，里面的行保持扁平，用分隔线区分。
// inset 为 true 时去掉外层卡片，用于嵌在 Card 里。
export default function PostList({
  posts,
  thumbnails = true,
  inset = false,
}: {
  posts: PostMeta[];
  thumbnails?: boolean;
  inset?: boolean;
}) {
  if (posts.length === 0) {
    return (
      <div className="neu-raised rounded-[28px] px-6 py-12 text-center">
        <p className="text-[17px] font-semibold text-ink-strong">还没有文章</p>
        <p className="mt-2 text-[15px] text-muted">
          在 <code className="font-mono text-sm">content/blog/</code> 下新建 .mdx 文件即可发布。
        </p>
      </div>
    );
  }

  return (
    <ul className={inset ? "flat divide-y divide-edge overflow-hidden rounded-[18px]" : "neu-raised divide-y divide-edge rounded-[28px] p-2"}>
      {posts.map((post) => (
        <li key={`${post.category}/${post.slug}`}>
          <Link
            href={`/blog/${post.category}/${post.slug}/`}
            className="group flex min-h-11 items-center gap-4 rounded-[20px] px-3 py-4 transition-colors hover:bg-well"
          >
            {thumbnails && <ImageFrame src={post.cover} alt="" ratio="1/1" compact className="w-14 shrink-0" />}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[16px] font-semibold text-ink-strong">{post.title}</p>
              {post.description && <p className="mt-0.5 line-clamp-1 text-[14px] text-muted">{post.description}</p>}
              <p className="mt-1 font-mono text-[11px] text-muted">
                {post.date} · {categories[post.category]}
              </p>
            </div>
            <CaretRight size={16} weight="bold" className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
