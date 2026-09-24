import PostCard from "./PostCard";
import type { PostMeta } from "@/lib/posts";

export default function PostList({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return <p className="py-6 text-neutral-500">还没有文章。</p>;
  return (
    <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
      {posts.map((post) => (
        <PostCard key={`${post.category}/${post.slug}`} post={post} />
      ))}
    </div>
  );
}
