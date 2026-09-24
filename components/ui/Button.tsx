import Link from "next/link";

const variants = {
  primary: "bg-accent text-on-accent hover:brightness-110",
  secondary: "flat text-ink-strong hover:bg-well-hover hover:text-accent",
} as const;

// 扁平按钮（通常放在卡片里）。44px 高：满足 HIG 最小点击区域。
export default function Button({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: keyof typeof variants;
  children: React.ReactNode;
}) {
  const className = `inline-flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-medium transition-[filter,color,background-color,transform] active:scale-[0.98] ${variants[variant]}`;
  const external = /^(https?:|mailto:)/.test(href);

  return external ? (
    <a href={href} className={className} {...(href.startsWith("http") && { target: "_blank", rel: "noreferrer" })}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
