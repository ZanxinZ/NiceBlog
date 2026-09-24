import { evaluate, type EvaluateOptions } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import Link from "next/link";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import type { ComponentProps, ReactNode } from "react";
import Callout from "./Callout";
import CodeFigure from "./CodeFigure";
import Mermaid from "./Mermaid";
import remarkMermaid from "./remark-mermaid";
import Kbd from "@/components/ui/Kbd";
import { withBase } from "@/lib/base";
import { slugify } from "@/lib/content";

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node) return textOf((node.props as { children?: ReactNode }).children);
  return "";
}

function heading(Tag: "h2" | "h3") {
  return function Heading({ children, ...props }: ComponentProps<"h2">) {
    const id = slugify(textOf(children));
    return (
      <Tag id={id} className="group" {...props}>
        {children}
        <a href={`#${id}`} aria-label="链接到此标题" data-pagefind-ignore className="ml-2 text-accent no-underline opacity-0 transition-opacity group-hover:opacity-100">
          #
        </a>
      </Tag>
    );
  };
}

// 在这里注册可以在 MDX 中直接使用的组件，例如 <Callout>、<Kbd>。
const components = {
  a: ({ href = "", ...props }: ComponentProps<"a">) =>
    href.startsWith("/") ? <Link href={href} {...props} /> : href.startsWith("#") ? <a href={href} {...props} /> : <a href={href} target="_blank" rel="noreferrer" {...props} />,
  // eslint-disable-next-line @next/next/no-img-element
  img: ({ src = "", alt = "", ...props }: ComponentProps<"img">) => <img src={typeof src === "string" ? withBase(src) : src} alt={alt} loading="lazy" {...props} />,
  table: (props: ComponentProps<"table">) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
  // rehype-pretty-code 生成的代码块外框：加复制按钮
  figure: (props: ComponentProps<"figure">) =>
    "data-rehype-pretty-code-figure" in props ? <CodeFigure {...props} /> : <figure {...props} />,
  h2: heading("h2"),
  h3: heading("h3"),
  Callout,
  Kbd,
  Mermaid,
};

// 代码高亮：构建时由 Shiki 生成，浅色 / 深色两套配色用 CSS 变量切换（见 globals.css）。
// 所有代码块都显示行号；可写标题 ```swift title="RootView.swift"，或高亮行 ```swift {2,4-5}
const rehypePlugins: NonNullable<EvaluateOptions["rehypePlugins"]> = [
  [
    rehypePrettyCode,
    {
      theme: { light: "github-light", dark: "github-dark" },
      keepBackground: false,
      defaultLang: "plaintext",
      filterMetaString: (meta: string) => `${meta} showLineNumbers`,
    },
  ],
];

export default async function Markdown({ source }: { source: string }) {
  const { default: Content } = await evaluate(source, { ...runtime, baseUrl: import.meta.url, remarkPlugins: [remarkGfm, remarkMermaid], rehypePlugins });
  return (
    <div className="prose prose-neutral max-w-none">
      <Content components={components} />
    </div>
  );
}
