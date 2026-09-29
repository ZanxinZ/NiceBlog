import { notFound, redirect } from "next/navigation";
import { allItems, getAiKinds } from "@/lib/ai";

// /ai/ 没有单独的页面，直接跳到第一个条目。
export default function AiHome() {
  const first = getAiKinds().flatMap(allItems)[0];
  if (!first) notFound();
  redirect(first.href);
}
