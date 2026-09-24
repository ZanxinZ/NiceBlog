"use client";

import { usePathname } from "next/navigation";
import SegmentedNav from "@/components/ui/SegmentedNav";
import { nav } from "@/lib/site";

// 顶部导航：Header 在根 layout 里，切换页面时保持挂载，胶囊会滑动。
export default function NavLinks() {
  const raw = usePathname();
  const pathname = raw.endsWith("/") ? raw : raw + "/";
  const activeIndex = nav.findIndex((item) => [item.href, ...("also" in item ? item.also : [])].some((p) => pathname.startsWith(p)));

  return <SegmentedNav label="主导航" items={nav.map(({ href, label }) => ({ href, label }))} activeIndex={activeIndex} />;
}
