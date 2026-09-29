import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AiItemView } from "@/components/ai/AiPreview";
import { allItems, getAiItem, getAiKind, getAiKinds } from "@/lib/ai";

type Props = { params: Promise<{ kind: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAiKinds().flatMap((k) => allItems(k).map(({ kind, slug }) => ({ kind, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kind, slug } = await params;
  const item = getAiItem(kind, slug);
  return item ? { title: item.title, description: item.description } : {};
}

export default async function AiItemPage({ params }: Props) {
  const { kind, slug } = await params;
  const item = getAiItem(kind, slug);
  const k = getAiKind(kind);
  if (!item || !k) notFound();
  return <AiItemView item={item} kindTitle={k.title} />;
}
