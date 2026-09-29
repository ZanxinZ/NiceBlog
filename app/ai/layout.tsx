import AiSidebar from "@/components/ai/AiSidebar";
import Container from "@/components/ui/Container";
import { getAiKinds } from "@/lib/ai";

// AI 协作资料区：左侧能力面板，右侧内容预览。
export default function AiLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container className="pb-8 pt-6 lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-8">
      <AiSidebar kinds={getAiKinds()} />
      <div className="mt-6 min-w-0 lg:mt-0">{children}</div>
    </Container>
  );
}
