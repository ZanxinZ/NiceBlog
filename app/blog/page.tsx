import type { Metadata } from "next";
import FilteredPostList from "@/components/blog/FilteredPostList";
import Reveal from "@/components/ui/Reveal";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = { title: "文档" };

// 页头和分类切换在 layout（BlogChrome）里，这里只渲染列表和 tag 筛选。
export default function Blog() {
  return (
    <Reveal className="mt-6">
      <FilteredPostList posts={getPosts()} />
    </Reveal>
  );
}
