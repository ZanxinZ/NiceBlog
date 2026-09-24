import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import Link from "next/link";
import type { ComponentProps } from "react";

// 在这里注册可以在 MDX 中直接使用的组件，例如 <Callout>、<Demo />。
const components = {
  a: ({ href = "", ...props }: ComponentProps<"a">) =>
    href.startsWith("/") ? <Link href={href} {...props} /> : <a href={href} target="_blank" rel="noreferrer" {...props} />,
  Callout: ({ children }: { children: React.ReactNode }) => (
    <div className="not-prose my-6 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-[15px] leading-relaxed dark:border-neutral-800 dark:bg-neutral-900">
      {children}
    </div>
  ),
};

export default async function Markdown({ source }: { source: string }) {
  const { default: Content } = await evaluate(source, { ...runtime, baseUrl: import.meta.url });
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:underline-offset-4 prose-pre:bg-neutral-900 prose-pre:text-neutral-100">
      <Content components={components} />
    </div>
  );
}
