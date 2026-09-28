import Link from "next/link";
import { ArrowUpRight, CaretLeft } from "@phosphor-icons/react/dist/ssr";
import Markdown from "@/components/mdx/Markdown";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import ImageFrame from "@/components/ui/ImageFrame";
import Reveal from "@/components/ui/Reveal";
import Tag from "@/components/ui/Tag";
import WindowChrome from "@/components/ui/WindowChrome";
import { withBase } from "@/lib/base";
import type { Project } from "@/lib/projects";

// 项目 / 产品详情页：扁平面板，和文章页保持一致。有 screenshots 时在正文前加一排横向滚动的截图。
export default function ProjectDetail({ project: p, back }: { project: Project; back: { href: string; label: string } }) {
  const facts = [
    { label: "年份", value: p.year },
    { label: "角色", value: p.role },
    { label: "技术", value: p.stack.join(" · ") },
  ].filter((f) => f.value);

  return (
    <Container className="pb-8 pt-8 sm:pt-12">
      <Link href={back.href} className="inline-flex min-h-11 items-center gap-1 text-[15px] font-medium text-accent">
        <CaretLeft size={16} weight="bold" />
        {back.label}
      </Link>

      <article data-pagefind-body className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
          <Reveal className="min-w-0">
            <Card variant="flat" className="flex h-full flex-col sm:p-8">
              {p.status && (
                <div>
                  <Tag tone={p.tone}>{p.status}</Tag>
                </div>
              )}
              <h1 className="mt-3 text-balance text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-ink-strong sm:text-[40px]">{p.title}</h1>
              <p className="mt-3 text-[17px] text-muted">{p.summary}</p>
              <dl className="flat mt-6 divide-y divide-edge rounded-[18px] px-4">
                {facts.map((f) => (
                  <div key={f.label} className="flex min-h-11 items-center justify-between gap-4 py-2.5">
                    <dt className="text-[15px] text-muted">{f.label}</dt>
                    <dd className="text-right text-[15px] text-ink-strong">{f.value}</dd>
                  </div>
                ))}
              </dl>
              {p.links.length > 0 && (
                <div className="mt-auto flex flex-wrap gap-3 pt-6">
                  {p.links.map((l, i) => (
                    <Button key={l.href} href={l.href} variant={i === 0 ? "primary" : "secondary"}>
                      {l.label} <ArrowUpRight size={14} weight="bold" />
                    </Button>
                  ))}
                </div>
              )}
            </Card>
          </Reveal>
          <Reveal index={1} className="min-w-0">
            <Card variant="flat" className="flex h-full items-center [&>*]:w-full">
              {p.cover || !p.preview ? (
                <ImageFrame src={p.cover} alt={p.title} hint={`${back.label}图片位置`} />
              ) : (
                <WindowChrome title={p.previewTitle || p.slug}>
                  <pre className="overflow-x-auto px-5 pb-5 font-mono text-[13px] leading-relaxed text-ink">{p.preview}</pre>
                </WindowChrome>
              )}
            </Card>
          </Reveal>
        </div>

        {p.screenshots.length > 0 && (
          <Reveal index={2} className="min-w-0">
            <Card variant="flat" className="px-5 py-6 sm:px-8">
              <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8">
                {p.screenshots.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={withBase(src)}
                    alt={`${p.title} 截图`}
                    loading="lazy"
                    className="w-[180px] shrink-0 snap-start rounded-[18px] ring-1 ring-edge sm:w-[220px]"
                  />
                ))}
              </div>
            </Card>
          </Reveal>
        )}

        <Reveal index={3}>
          <Card variant="flat" className="px-5 py-8 sm:px-10 sm:py-12">
            <div className="mx-auto max-w-3xl">
              <Markdown source={p.content} />
            </div>
          </Card>
        </Reveal>
      </article>
    </Container>
  );
}
