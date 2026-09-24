import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocView from "@/components/docs/DocView";
import { getDoc, getDocsInOrder } from "@/lib/docs";

type Props = { params: Promise<{ slug: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getDocsInOrder()
    .filter((d) => d.slug.length > 0)
    .map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = getDoc((await params).slug);
  return doc ? { title: doc.title, description: doc.description } : {};
}

export default async function DocPage({ params }: Props) {
  const doc = getDoc((await params).slug);
  if (!doc) notFound();
  return <DocView doc={doc} />;
}
