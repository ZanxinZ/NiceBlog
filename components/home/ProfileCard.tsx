import { EnvelopeSimple, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import { site } from "@/lib/site";

export default function ProfileCard() {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <Avatar size={64} />
        <div className="min-w-0">
          <p className="text-[20px] font-semibold tracking-[-0.01em] text-ink-strong">{site.name}</p>
          <p className="text-[15px] text-muted">{site.role}</p>
        </div>
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-ink">{site.intro}</p>
      <div className="mt-5 flex gap-3">
        <a
          href={`mailto:${site.email}`}
          aria-label="发送邮件"
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-accent text-[15px] font-medium text-on-accent transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
        >
          <EnvelopeSimple size={18} weight="bold" />
          邮件
        </a>
        <a
          href={site.github}
          aria-label="GitHub"
          className="flat flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-[15px] font-medium text-ink-strong transition-[background-color,transform] hover:bg-well-hover active:scale-[0.98]"
        >
          <GithubLogo size={18} weight="bold" />
          GitHub
        </a>
      </div>
    </Card>
  );
}
