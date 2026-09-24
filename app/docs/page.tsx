import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocView from "@/components/docs/DocView";
import { getDoc } from "@/lib/docs";

export const metadata: Metadata = { title: "文档" };

export default function DocsHome() {
  const doc = getDoc([]);
  if (!doc) notFound();
  return <DocView doc={doc} />;
}
