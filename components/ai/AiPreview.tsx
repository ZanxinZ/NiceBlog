import CopyArticleButton from "@/components/blog/CopyArticleButton";
import Markdown from "@/components/mdx/Markdown";
import Tag from "@/components/ui/Tag";
import type { AiItem } from "@/lib/ai";
import { buildExportFrom } from "@/lib/export";

// 右侧内容区：扁平面板，和文章页保持一致。
function Panel({ children }: { children: React.ReactNode }) {
  return <div className="flat-panel min-w-0 rounded-[28px] px-5 py-8 sm:px-10 sm:py-10">{children}</div>;
}

export function AiItemView({ item, kindTitle }: { item: AiItem; kindTitle: string }) {
  return (
    <Panel>
      <article data-pagefind-body className="mx-auto max-w-3xl">
        <header className="border-b border-edge pb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-semibold uppercase tracking-[0.06em] text-accent">{kindTitle}</span>
            {item.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="min-w-0 text-[30px] font-bold leading-[1.2] tracking-[-0.02em] text-ink-strong sm:text-[36px]">{item.title}</h1>
            <CopyArticleButton bundle={buildExportFrom({ ...item, cover: "" })} />
          </div>
          {item.description && <p className="mt-3 text-[17px] text-muted">{item.description}</p>}
        </header>
        <div className="pt-8">
          <Markdown source={item.content} />
        </div>
      </article>
    </Panel>
  );
}
