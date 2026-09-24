import Link from "next/link";
import { categories, type Category } from "@/lib/posts";

export default function CategoryTabs({ active }: { active?: Category }) {
  const tabs = [{ href: "/blog/", label: "All", key: undefined }, ...Object.entries(categories).map(([key, label]) => ({ href: `/blog/${key}/`, label, key }))];

  return (
    <nav className="flex gap-2 text-sm">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={
            t.key === active
              ? "rounded-full bg-neutral-900 px-3 py-1 text-white dark:bg-white dark:text-neutral-900"
              : "rounded-full px-3 py-1 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
          }
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
