import { EnvelopeSimple, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import Container from "@/components/ui/Container";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-16">
      <Container className="pb-10">
        <div className="flat flex flex-col gap-4 rounded-[24px] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
            <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center gap-2 text-ink transition-colors hover:text-accent">
              <EnvelopeSimple size={18} weight="bold" className="text-muted" />
              {site.email}
            </a>
            <a href={site.github} className="inline-flex min-h-11 items-center gap-2 text-ink transition-colors hover:text-accent">
              <GithubLogo size={18} weight="bold" className="text-muted" />
              GitHub
            </a>
          </div>
          <p className="font-mono text-xs text-muted">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
