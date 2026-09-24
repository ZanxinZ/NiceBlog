import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Card from "@/components/ui/Card";
import ImageFrame from "@/components/ui/ImageFrame";
import Reveal from "@/components/ui/Reveal";
import Tag from "@/components/ui/Tag";
import type { ProjectMeta } from "@/lib/projects";

// 不对称网格：第一个项目在左侧大卡片，接下来两个在右侧叠放，其余两列排开。
export default function ProjectGrid({ projects }: { projects: ProjectMeta[] }) {
  if (projects.length === 0) {
    return (
      <Card className="py-16 text-center">
        <p className="text-[17px] font-semibold text-ink-strong">还没有项目</p>
        <p className="mt-2 text-[15px] text-muted">
          在 <code className="font-mono text-sm">content/projects/</code> 下新建一个 .mdx 文件，这里会自动出现。
        </p>
      </Card>
    );
  }

  const [lead, ...others] = projects;
  const side = others.slice(0, 2);
  const rest = others.slice(2);

  return (
    <div className="grid gap-6">
      <div className={`grid gap-6 ${side.length ? "lg:grid-cols-[1.45fr_1fr]" : ""}`}>
        <Reveal className="min-w-0">
          <ProjectCard project={lead} lead />
        </Reveal>
        {side.length > 0 && (
          <div className="grid min-w-0 gap-6">
            {side.map((p, i) => (
              <Reveal key={p.slug} index={i + 1} className="min-w-0">
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
      {rest.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {rest.map((p, i) => (
            <Reveal key={p.slug} index={i} className="min-w-0">
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

// 大卡片：图在上、文字在下；小卡片：宽屏时图文左右并排。
function ProjectCard({ project: p, lead = false }: { project: ProjectMeta; lead?: boolean }) {
  return (
    <Card href={`/projects/${p.slug}/`} className={`flex h-full flex-col ${lead ? "" : "sm:flex-row sm:gap-5"}`}>
      <ImageFrame src={p.cover} alt={p.title} ratio={lead ? "16/10" : "4/3"} hint="项目图片位置" className={lead ? "" : "sm:w-[46%] sm:shrink-0 sm:self-center"} />
      <div className={`flex min-w-0 flex-1 flex-col px-1 ${lead ? "pt-6" : "pt-5 sm:pt-1"}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {p.status && <Tag tone={p.tone}>{p.status}</Tag>}
            <span className="font-mono text-xs text-muted">{p.year}</span>
          </div>
          <span className="flat flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors group-hover:text-accent">
            <ArrowUpRight size={16} weight="bold" />
          </span>
        </div>
        <h3 className={`mt-3 font-semibold tracking-[-0.015em] text-ink-strong transition-colors group-hover:text-accent ${lead ? "text-[28px]" : "text-[20px]"}`}>
          {p.title}
        </h3>
        <p className={`mt-2 text-muted ${lead ? "text-[17px]" : "line-clamp-3 text-[15px]"}`}>{p.summary}</p>
        <p className="mt-auto pt-4 font-mono text-xs text-muted">{p.stack.join(" · ")}</p>
      </div>
    </Card>
  );
}
