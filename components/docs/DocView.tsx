import Link from "next/link";
import Markdown from "@/components/mdx/Markdown";
import Toc from "./Toc";
import { extractHeadings } from "@/lib/content";
import { getDocsInOrder, type Doc } from "@/lib/docs";

export default function DocView({ doc }: { doc: Doc }) {
  const ordered = getDocsInOrder();
  const i = ordered.findIndex((d) => d.href === doc.href);
  const prev = i > 0 ? ordered[i - 1] : null;
  const next = i >= 0 && i < ordered.length - 1 ? ordered[i + 1] : null;

  return (
    <div className="mt-6 lg:mt-0 xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-8">
      <article data-pagefind-body className="neu-raised min-w-0 rounded-[28px] p-6 sm:p-10">
        <header className="mb-8">
          <h1 className="text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-ink-strong sm:text-[40px]">{doc.title}</h1>
          {doc.description && <p className="mt-3 text-[17px] text-muted">{doc.description}</p>}
        </header>
        <Markdown source={doc.content} />

        {(prev || next) && (
          <nav data-pagefind-ignore className="mt-12 grid gap-4 sm:grid-cols-2">
            {prev && <PagerLink doc={prev} label="上一篇" />}
            {next && <PagerLink doc={next} label="下一篇" className="sm:col-start-2 sm:text-right" />}
          </nav>
        )}
      </article>

      <aside className="hidden xl:block">
        <div className="neu-raised sticky top-[84px] rounded-[28px] p-5">
          <Toc headings={extractHeadings(doc.content)} />
        </div>
      </aside>
    </div>
  );
}

function PagerLink({ doc, label, className = "" }: { doc: { href: string; title: string }; label: string; className?: string }) {
  return (
    <Link href={doc.href} className={`flat rounded-[18px] px-5 py-4 transition-[background-color,transform] hover:bg-well-hover active:scale-[0.98] ${className}`}>
      <p className="text-[13px] text-muted">{label}</p>
      <p className="mt-1 font-medium text-accent">{doc.title}</p>
    </Link>
  );
}
