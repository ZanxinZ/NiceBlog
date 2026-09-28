import Card from "@/components/ui/Card";
import ImageFrame from "@/components/ui/ImageFrame";
import Tag from "@/components/ui/Tag";
import { categories, type PostMeta } from "@/lib/posts";

// 首页文档页的头条文章。
export default function FeaturedPost({ post }: { post: PostMeta }) {
  return (
    <Card href={`/blog/${post.category}/${post.slug}/`} className="flex h-full flex-col">
      <ImageFrame src={post.cover} alt={post.title} hint="文章封面位置" />
      <div className="flex flex-1 flex-col px-1 pt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone="blue">{categories[post.category]}</Tag>
          <time dateTime={post.date} className="font-mono text-xs text-muted">
            {post.date}
          </time>
        </div>
        <h3 className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.015em] text-ink-strong transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        {post.description && <p className="mt-2 max-w-[65ch] text-[17px] text-muted">{post.description}</p>}
        {post.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {post.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
