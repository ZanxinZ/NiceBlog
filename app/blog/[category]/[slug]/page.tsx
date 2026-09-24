import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import PostToc from "@/components/blog/PostToc";
import Markdown from "@/components/mdx/Markdown";
import Container from "@/components/ui/Container";
import ImageFrame from "@/components/ui/ImageFrame";
import Tag from "@/components/ui/Tag";
import { extractHeadings } from "@/lib/content";
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

// 文章页：扁平布局。目录栏悬浮贴在视口左侧，不占正文布局。
export default async function PostPage({ params }: Props) {
  const post = await load(params);
  if (!post || post.draft) notFound();

  const headings = extractHeadings(post.content);

  return (
    <Container className="pb-8 pt-6 sm:pt-8">
      <div>
        {headings.length > 0 && <PostToc headings={headings} />}

        <article data-pagefind-body className="flat-panel min-w-0 rounded-[28px] px-5 py-8 sm:px-10 sm:py-12">
          <div className="mx-auto max-w-3xl">
            <header className="border-b border-edge pb-8">
              <Link href={`/blog/${post.category}/`} className="-ml-1 mb-3 inline-flex min-h-11 items-center gap-1 text-[15px] font-medium text-accent">
                <CaretLeft size={16} weight="bold" />
                {categories[post.category]}
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <time dateTime={post.date} className="font-mono text-xs text-muted">
                  {post.date}
                </time>
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/blog/?tag=${encodeURIComponent(tag)}`} className="transition-opacity hover:opacity-70">
                    <Tag>{tag}</Tag>
                  </Link>
                ))}
              </div>
              <h1 className="mt-3 text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-ink-strong sm:text-[40px]">{post.title}</h1>
              {post.description && <p className="mt-3 text-[17px] text-muted">{post.description}</p>}
              {post.cover && <ImageFrame src={post.cover} alt={post.title} className="mt-6" />}
            </header>
            <div className="pt-8">
              <Markdown source={post.content} />
            </div>
          </div>
        </article>
      </div>
    </Container>
  );
}
