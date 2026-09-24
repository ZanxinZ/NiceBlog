"use client";

import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import SegmentedNav from "@/components/ui/SegmentedNav";

// 文档列表页（/blog/ 和 /blog/<分类>/）共用的页头 + 分类切换。
// 放在 layout 里，切换分类时这部分保持挂载，分段控件的胶囊才能滑动；
// 文章详情页（/blog/<分类>/<文章>/）直接渲染，不套这层。
export default function BlogChrome({ categories, children }: { categories: Record<string, string>; children: React.ReactNode }) {
  const segments = usePathname().split("/").filter(Boolean); // ["blog", 分类?, 文章?]
  if (segments.length > 2) return <>{children}</>;

  const category = segments[1];
  const keys = Object.keys(categories);
  const items = [{ href: "/blog/", label: "全部" }, ...keys.map((key) => ({ href: `/blog/${key}/`, label: categories[key] }))];
  const activeIndex = category ? keys.indexOf(category) + 1 : 0;

  return (
    <Container size="prose" className="pb-8">
      <PageHeader eyebrow="Blog" />
      <SegmentedNav label="分类" items={items} activeIndex={activeIndex} />
      {children}
    </Container>
  );
}
