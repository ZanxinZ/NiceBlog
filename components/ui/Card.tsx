import Link from "next/link";

// 卡片：默认是凸起的新拟物；variant="flat" 为扁平面板。可点击的卡片按下时有反馈。
export default function Card({
  href,
  variant = "raised",
  className = "",
  children,
}: {
  href?: string;
  variant?: "raised" | "flat";
  className?: string;
  children: React.ReactNode;
}) {
  const base = `${variant === "flat" ? "flat-panel" : "neu-raised"} block rounded-[28px] p-5 sm:p-6 ${className}`;
  return href ? (
    <Link href={href} className={`group neu-press ${base}`}>
      {children}
    </Link>
  ) : (
    <div className={base}>{children}</div>
  );
}

// 卡片内的小节标题（HIG 分组标题样式）。
export function CardTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4 px-1">
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">{children}</h2>
      {action}
    </div>
  );
}
