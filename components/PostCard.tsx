import Link from "next/link";
import { categories, type PostMeta } from "@/lib/posts";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group py-5">
      <Link href={`/blog/${post.category}/${post.slug}/`} className="block">
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <time dateTime={post.date}>{post.date}</time>
          <span>·</span>
          <span>{categories[post.category]}</span>
        </div>
        <h3 className="mt-1.5 text-lg font-medium tracking-tight group-hover:underline group-hover:underline-offset-4">
          {post.title}
        </h3>
        {post.description && (
          <p className="mt-1 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">{post.description}</p>
        )}
      </Link>
    </article>
  );
}
