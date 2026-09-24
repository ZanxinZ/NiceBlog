import Reveal from "./Reveal";

// HIG 大标题：小标签 + 34px 粗体标题 + 说明。
export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <Reveal className="pb-8 pt-12 sm:pb-10 sm:pt-16">
      {eyebrow && <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-accent">{eyebrow}</p>}
      {title && <h1 className="mt-2 text-[34px] font-bold leading-[1.15] tracking-[-0.02em] text-ink-strong sm:text-[40px]">{title}</h1>}
      {description && <p className="mt-3 max-w-[65ch] text-[17px] text-muted">{description}</p>}
      {children}
    </Reveal>
  );
}
