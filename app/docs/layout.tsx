import DocsSidebar from "@/components/docs/DocsSidebar";
import Container from "@/components/ui/Container";
import { getDocTree } from "@/lib/docs";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="pt-6 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
      <DocsSidebar tree={getDocTree()} />
      <div className="min-w-0">{children}</div>
    </Container>
  );
}
