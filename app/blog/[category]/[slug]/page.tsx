import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import { categories, getPost, getPosts, isCategory } from "@/lib/posts";

type Props = { params: Promise<{ category: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map(({ category, slug }) => ({ category, slug }));
}

async function load(params: Props["params"]) {
  const { category, slug } = await params;
  return isCategory(category) ? getPost(category, slug) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await load(params);
  return post ? { title: post.title, description: post.description } : {};
}

export default async function PostPage({ params }: Props) {
  const post = await load(params);
  if (!post || post.draft) notFound();

  return (
    <article className="py-12">
      <Link href={`/blog/${post.category}/`} className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
        ← {categories[post.category]}
      </Link>
      <header className="mb-10 mt-6">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{post.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-500">
          <time dateTime={post.date}>{post.date}</time>
          {post.tags.map((tag) => <span key={tag}>#{tag}</span>)}
        </div>
      </header>
      <Markdown source={post.content} />
    </article>
  );
}
