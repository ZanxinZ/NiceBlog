import Link from "next/link";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

// 门户首页的一「页」：至少一屏高，顶部是页码、大标题和入口链接。
export default function PortalPage({
  id,
  index,
  total,
  title,
  description,
  action,
  children,
}: {
  id: string;
  index: number;
  total: number;
  title: string;
  description: string;
  action: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="flex min-h-[calc(100dvh-68px)] scroll-mt-[68px] flex-col justify-center py-12 sm:py-16">
      <Container>
        <Reveal className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[13px] text-muted">
              <span className="text-accent">{String(index).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}
            </p>
            <h2 className="mt-2 text-[34px] font-bold leading-tight tracking-[-0.02em] text-ink-strong sm:text-[40px]">{title}</h2>
            <p className="mt-2 text-[17px] text-muted">{description}</p>
          </div>
          <Link
            href={action.href}
            className="neu-raised-sm neu-press inline-flex h-11 shrink-0 items-center self-start rounded-full px-5 text-[15px] font-medium text-accent sm:self-auto"
          >
            {action.label}
          </Link>
        </Reveal>
        {children}
      </Container>
    </section>
  );
}
