import Reveal from "./Reveal";

// HIG 大标题：小标签 + 34px 粗体标题 + 说明。action 显示在标题右侧（如分享按钮）。
export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    // Reveal 的动画会生成独立的层叠上下文，action 里的弹出菜单无法越过后面的卡片，所以整个标题区要抬高一层。
    <Reveal className={`pb-8 pt-12 sm:pb-10 sm:pt-16 ${action ? "relative z-20" : ""}`}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-accent">{eyebrow}</p>}
          {title && <h1 className="mt-2 text-[34px] font-bold leading-[1.15] tracking-[-0.02em] text-ink-strong sm:text-[40px]">{title}</h1>}
        </div>
        {action}
      </div>
      {description && <p className="mt-3 max-w-[65ch] text-[17px] text-muted">{description}</p>}
      {children}
    </Reveal>
  );
}
