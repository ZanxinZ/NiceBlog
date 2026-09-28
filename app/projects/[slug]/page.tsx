import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CaretLeft } from "@phosphor-icons/react/dist/ssr";
import Markdown from "@/components/mdx/Markdown";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import ImageFrame from "@/components/ui/ImageFrame";
import Reveal from "@/components/ui/Reveal";
import Tag from "@/components/ui/Tag";
import WindowChrome from "@/components/ui/WindowChrome";
import { getProject, getProjects } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: project.title, description: project.summary } : {};
}

// 项目详情页：扁平面板，和文章页保持一致。
export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project || project.draft) notFound();

  const facts = [
    { label: "年份", value: project.year },
    { label: "角色", value: project.role },
    { label: "技术", value: project.stack.join(" · ") },
  ].filter((f) => f.value);

  return (
    <Container className="pb-8 pt-8 sm:pt-12">
      <Link href="/projects/" className="inline-flex min-h-11 items-center gap-1 text-[15px] font-medium text-accent">
        <CaretLeft size={16} weight="bold" />
        项目
      </Link>

      <article data-pagefind-body className="mt-4 grid gap-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
          <Reveal className="min-w-0">
            <Card variant="flat" className="flex h-full flex-col sm:p-8">
              {project.status && (
                <div>
                  <Tag tone={project.tone}>{project.status}</Tag>
                </div>
              )}
              <h1 className="mt-3 text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-ink-strong sm:text-[40px]">{project.title}</h1>
              <p className="mt-3 text-[17px] text-muted">{project.summary}</p>
              <dl className="flat mt-6 divide-y divide-edge rounded-[18px] px-4">
                {facts.map((f) => (
                  <div key={f.label} className="flex min-h-11 items-center justify-between gap-4 py-2.5">
                    <dt className="text-[15px] text-muted">{f.label}</dt>
                    <dd className="text-right text-[15px] text-ink-strong">{f.value}</dd>
                  </div>
                ))}
              </dl>
              {project.links.length > 0 && (
                <div className="mt-auto flex flex-wrap gap-3 pt-6">
                  {project.links.map((l, i) => (
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
              {project.cover || !project.preview ? (
                <ImageFrame src={project.cover} alt={project.title} hint="项目图片位置" />
              ) : (
                <WindowChrome title={project.previewTitle || project.slug}>
                  <pre className="overflow-x-auto px-5 pb-5 font-mono text-[13px] leading-relaxed text-ink">{project.preview}</pre>
                </WindowChrome>
              )}
            </Card>
          </Reveal>
        </div>

        <Reveal index={2}>
          <Card variant="flat" className="px-5 py-8 sm:px-10 sm:py-12">
            <div className="mx-auto max-w-3xl">
              <Markdown source={project.content} />
            </div>
          </Card>
        </Reveal>
      </article>
    </Container>
  );
}
