"use client";

import { useEffect, useId, useState } from "react";

type State = { status: "loading" } | { status: "ready"; svg: string } | { status: "error"; message: string };

// Mermaid 流程图：只在出现图表的页面按需加载 mermaid（体积较大），
// 跟随系统浅色 / 深色切换主题；加载前和出错时显示原始代码，保证内容可读。
export default function Mermaid({ chart }: { chart: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    async function render() {
      try {
        const { default: mermaid } = await import("mermaid");
        const css = getComputedStyle(document.documentElement);
        const token = (name: string) => css.getPropertyValue(name).trim();
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          fontFamily: css.getPropertyValue("font-family"),
          themeVariables: {
            darkMode: media.matches,
            background: "transparent",
            fontSize: "14px",
            primaryColor: token("--panel"),
            primaryTextColor: token("--ink-strong"),
            primaryBorderColor: token("--accent"),
            secondaryColor: token("--accent-soft"),
            tertiaryColor: token("--canvas"),
            lineColor: token("--muted"),
            textColor: token("--ink"),
            noteBkgColor: token("--yellow-bg"),
            noteTextColor: token("--yellow-fg"),
            noteBorderColor: token("--edge"),
            // 连线文字的底色：默认会推导成很亮的颜色，改成和图表背景一致
            edgeLabelBackground: token("--well"),
            clusterBkg: token("--canvas"),
            clusterBorder: token("--edge"),
          },
        });
        const { svg } = await mermaid.render(`mermaid-${id}-${media.matches ? "d" : "l"}`, chart);
        if (!cancelled) setState({ status: "ready", svg });
      } catch (err) {
        if (!cancelled) setState({ status: "error", message: err instanceof Error ? err.message : String(err) });
      }
    }

    render();
    media.addEventListener("change", render);
    return () => {
      cancelled = true;
      media.removeEventListener("change", render);
    };
  }, [chart, id]);

  if (state.status === "ready") {
    return (
      <figure
        data-pagefind-ignore
        className="not-prose my-6 flex justify-center overflow-x-auto rounded-[16px] border border-edge bg-well p-5 [&_svg]:h-auto [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: state.svg }}
      />
    );
  }

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-[16px] border border-edge bg-well">
      {state.status === "error" && (
        <figcaption className="border-b border-edge bg-red-bg px-4 py-2 text-[13px] text-red-fg">流程图渲染失败：{state.message}</figcaption>
      )}
      <pre className={`overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-muted ${state.status === "loading" ? "animate-pulse" : ""}`}>{chart}</pre>
    </figure>
  );
}
