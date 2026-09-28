import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";
import { getProduct, getProducts } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getProducts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getProduct((await params).slug);
  return item ? { title: item.title, description: item.summary } : {};
}

export default async function ProductPage({ params }: Props) {
  const item = getProduct((await params).slug);
  if (!item || item.draft) notFound();
  return <ProjectDetail project={item} back={{ href: "/products/", label: "产品" }} />;
}
