// 进入视口时淡入上移。纯 CSS 实现（scroll-driven animation），不依赖 JS：
// 浏览器不支持、或 JS 加载失败时，内容始终直接显示。index 用于列表错峰。
export default function Reveal({
  as: Tag = "div",
  index = 0,
  className = "",
  children,
}: {
  as?: "div" | "li" | "section" | "article";
  index?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag className={`reveal ${className}`} style={{ "--index": index } as React.CSSProperties}>
      {children}
    </Tag>
  );
}
