import { Info, Lightbulb, Warning } from "@phosphor-icons/react/dist/ssr";

const types = {
  note: { icon: Info, className: "bg-blue-bg text-blue-fg" },
  tip: { icon: Lightbulb, className: "bg-green-bg text-green-fg" },
  warn: { icon: Warning, className: "bg-yellow-bg text-yellow-fg" },
} as const;

// MDX 用法：<Callout>…</Callout>，或 <Callout type="tip">…</Callout>
export default function Callout({ type = "note", children }: { type?: keyof typeof types; children: React.ReactNode }) {
  const { icon: Icon, className } = types[type] ?? types.note;
  return (
    <div className="not-prose flat my-6 flex gap-3 rounded-[18px] p-4 text-[15px] leading-relaxed text-ink">
      <span className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${className}`}>
        <Icon size={14} weight="bold" />
      </span>
      <div className="min-w-0 [&_code]:rounded-md [&_code]:bg-surface [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.875em]">{children}</div>
    </div>
  );
}
