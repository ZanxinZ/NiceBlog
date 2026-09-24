import type { Metadata } from "next";
import PostList from "@/components/PostList";
import CategoryTabs from "./CategoryTabs";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = { title: "Blog" };

export default function Blog() {
  return (
    <div className="py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
      <div className="mt-6"><CategoryTabs /></div>
      <div className="mt-4"><PostList posts={getPosts()} /></div>
    </div>
  );
}
