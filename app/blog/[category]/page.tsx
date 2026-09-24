import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostList from "@/components/PostList";
import CategoryTabs from "../CategoryTabs";
import { categories, getPosts, isCategory } from "@/lib/posts";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(categories).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return { title: isCategory(category) ? categories[category] : "Blog" };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  return (
    <div className="py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{categories[category]}</h1>
      <div className="mt-6"><CategoryTabs active={category} /></div>
      <div className="mt-4"><PostList posts={getPosts(category)} /></div>
    </div>
  );
}
