import type { Metadata } from "next";
import Link from "next/link";
import {
  Browsers,
  CaretRight,
  DeviceMobile,
  TreeStructure,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";
import ProfileCard from "@/components/home/ProfileCard";
import Card, { CardTitle } from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { getDocTree } from "@/lib/docs";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "关于" };

const icons = {
  mobile: DeviceMobile,
  web: Browsers,
  architecture: TreeStructure,
  tooling: Wrench,
};

// 内容来自 lib/site.ts；文档入口收纳在本页底部。
export default function About() {
  const docGroups = getDocTree().filter((g) => g.key);

  return (
    <Container className="pb-8">
      <div data-pagefind-body>
        <PageHeader
          eyebrow="About"
          title={`Hi👋，我是 ${site.name}`}
          description="💻专注于 iOS 软件工程师，喜欢把复杂的东西做简单。"
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.45fr]">
          <div className="grid content-start gap-6">
            <Reveal>
              <ProfileCard />
            </Reveal>
            <Reveal index={1}>
              <Card>
                <CardTitle>近期动态</CardTitle>
                <ul className="flat divide-y divide-edge overflow-hidden rounded-[18px] px-4">
                  {site.now.map((item, i) => (
                    <li
                      key={item}
                      className="flex min-h-11 items-center gap-3 py-3 text-[15px] text-ink"
                    >
                      <span className="font-mono text-xs text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
            <Reveal index={2}>
              <Card>
                <CardTitle>技术栈</CardTitle>
                <div className="flex flex-wrap gap-2.5">
                  {site.stack.map((s) => (
                    <span
                      key={s}
                      className="flat rounded-full px-3.5 py-1.5 font-mono text-[13px] text-ink"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Card>
            </Reveal>
          </div>

          <div className="grid content-start gap-6">
            <Reveal index={1}>
              <Card>
                <CardTitle>工作经历</CardTitle>
                <ol className="grid gap-4">
                  {site.experience.map((e) => (
                    <li key={e.period} className="flat rounded-[18px] p-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <p className="text-[17px] font-semibold text-ink-strong">
                          {e.role}{" "}
                          <span className="font-normal text-muted">
                            · {e.org}
                          </span>
                        </p>
                        <p className="font-mono text-xs text-muted">
                          {e.period}
                        </p>
                      </div>
                      <ul className="mt-3 grid gap-1.5">
                        {e.highlights.map((h) => (
                          <li
                            key={h}
                            className="flex gap-2.5 text-[15px] text-ink"
                          >
                            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </Card>
            </Reveal>
            <Reveal index={2}>
              <Card>
                <CardTitle>技能点</CardTitle>
                <div className="grid gap-4 sm:grid-cols-2">
                  {site.capabilities.map((c, i) => {
                    const Icon = icons[c.icon];
                    return (
                      <div
                        key={c.title}
                        className={`flat rounded-[18px] p-5 ${i === 0 ? "sm:col-span-2" : ""}`}
                      >
                        <span className="flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent">
                          <Icon size={18} weight="bold" />
                        </span>
                        <p className="mt-4 text-[17px] font-semibold text-ink-strong">
                          {c.title}
                        </p>
                        <p className="mt-1 text-[15px] text-muted">{c.body}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </Reveal>
          </div>
        </div>

        {/* 网站文档 */}
        {docGroups.length > 0 && (
          <Reveal className="mt-6">
            <Card>
              <CardTitle
                action={
                  <Link
                    href="/docs/"
                    className="inline-flex min-h-11 items-center gap-1 text-[15px] font-medium text-accent"
                  >
                    全部文档 <CaretRight size={14} weight="bold" />
                  </Link>
                }
              >
                网站文档
              </CardTitle>
              <ul className="flat divide-y divide-edge overflow-hidden rounded-[18px] px-2">
                {docGroups.map((g) => (
                  <li key={g.key}>
                    <Link
                      href={g.href ?? g.pages[0]?.href ?? "/docs/"}
                      className="group flex min-h-11 items-center gap-4 px-3 py-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[16px] font-semibold text-ink-strong">
                          {g.title}
                        </p>
                        {g.description && (
                          <p className="mt-0.5 text-[14px] text-muted">
                            {g.description}
                          </p>
                        )}
                      </div>
                      <span className="font-mono text-xs text-muted">
                        {g.pages.length} 篇
                      </span>
                      <CaretRight
                        size={16}
                        weight="bold"
                        className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        )}
      </div>
    </Container>
  );
}
