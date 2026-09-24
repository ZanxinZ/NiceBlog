import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostList from "@/components/PostList";
import Reveal from "@/components/ui/Reveal";
import { categories, getPosts, isCategory } from "@/lib/posts";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(categories).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return { title: isCategory(category) ? categories[category] : "文档" };
}

// 页头和分类切换在 layout（BlogChrome）里，这里只渲染该分类的列表。
export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  return (
    <Reveal className="mt-6">
      <PostList posts={getPosts(category)} />
    </Reveal>
  );
}
