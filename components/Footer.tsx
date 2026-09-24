import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-3xl px-6 py-12 text-sm text-neutral-500">
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <a href={site.github} className="hover:text-neutral-900 dark:hover:text-white">GitHub</a>
        <a href={`mailto:${site.email}`} className="hover:text-neutral-900 dark:hover:text-white">Email</a>
      </div>
    </footer>
  );
}
