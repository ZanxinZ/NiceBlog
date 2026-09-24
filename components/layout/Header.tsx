import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Container from "@/components/ui/Container";
import NavLinks from "./NavLinks";
import Search from "./Search";
import { site } from "@/lib/site";

export default function Header() {
  return (
    <header className="glass sticky top-0 z-40">
      <Container className="flex h-[68px] items-center justify-between gap-3">
        <Link href="/" className="flex shrink-0 items-center gap-3 rounded-full" aria-label="首页">
          <Avatar size={40} />
          <span className="hidden text-[15px] font-semibold tracking-[-0.01em] text-ink-strong sm:inline">{site.name}</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <NavLinks />
          <Search />
        </div>
      </Container>
    </header>
  );
}
