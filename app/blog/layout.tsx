import BlogChrome from "./BlogChrome";
import { categories } from "@/lib/posts";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <BlogChrome categories={{ ...categories }}>{children}</BlogChrome>;
}
