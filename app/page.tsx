import Link from "next/link";
import PostList from "@/components/PostList";
import { getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

const now = ["用 SwiftUI 重写一个老项目", "整理 iOS 架构笔记", "每周三次力量训练"];

const experience = [
  { period: "2023 — 至今", role: "Senior iOS Engineer", org: "Company A" },
  { period: "2020 — 2023", role: "iOS Engineer", org: "Company B" },
];

const stack = ["Swift", "SwiftUI", "UIKit", "TypeScript", "React", "Next.js"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-10">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-neutral-500">{title}</h2>
      {children}
    </section>
  );
}

export default function Home() {
  const posts = getPosts().slice(0, 5);

  return (
    <>
      <section className="pb-6 pt-12">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{site.name}</h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">{site.tagline}</p>
        <p className="mt-6 max-w-2xl leading-relaxed">
          我是一名软件工程师，主要做 iOS 和 Web。这里记录我的工作经历、技术思考和日常生活。
          <Link href="/about/" className="ml-1 underline underline-offset-4">了解更多 →</Link>
        </p>
      </section>

      <Section title="Now">
        <ul className="list-inside list-disc space-y-1.5 leading-relaxed marker:text-neutral-400">
          {now.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </Section>

      <Section title="Experience">
        <ul className="space-y-3">
          {experience.map((e) => (
            <li key={e.period} className="flex flex-col gap-0.5 sm:flex-row sm:gap-6">
              <span className="w-32 shrink-0 text-sm tabular-nums text-neutral-500">{e.period}</span>
              <span>{e.role} · <span className="text-neutral-600 dark:text-neutral-400">{e.org}</span></span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Stack">
        <div className="flex flex-wrap gap-2">
          {stack.map((s) => (
            <span key={s} className="rounded-full border border-neutral-200 px-3 py-1 text-sm dark:border-neutral-800">{s}</span>
          ))}
        </div>
      </Section>

      <Section title="Recent Posts">
        <PostList posts={posts} />
        <Link href="/blog/" className="mt-4 inline-block text-sm underline underline-offset-4">全部文章 →</Link>
      </Section>
    </>
  );
}
