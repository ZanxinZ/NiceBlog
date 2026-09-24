import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container size="prose" className="py-20">
      <Card className="py-14 text-center sm:p-14">
        <p className="font-mono text-[13px] text-accent">404</p>
        <h1 className="mt-2 text-[34px] font-bold tracking-[-0.02em] text-ink-strong">这个页面不存在</h1>
        <p className="mt-3 text-[17px] text-muted">链接可能已经失效，或者内容被移动了。</p>
        <div className="mt-8">
          <Button href="/">回到首页</Button>
        </div>
      </Card>
    </Container>
  );
}
