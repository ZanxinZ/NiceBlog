import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import FeaturedPost from "@/components/home/FeaturedPost";
import PageDots from "@/components/home/PageDots";
import PortalPage from "@/components/home/PortalPage";
import PostList from "@/components/PostList";
import ProjectGrid from "@/components/ProjectGrid";
import Card, { CardTitle } from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import { categories, getPosts, type Category } from "@/lib/posts";
import { getProjects } from "@/lib/projects";

// 门户式首页：上一页是文档（/blog），下一页是项目。
export default function Home() {
  const posts = getPosts();
  const [featured, ...recent] = posts;
  const projects = getProjects().filter((p) => p.featured);

  return (
    <>
      <PageDots
        pages={[
          { id: "writing", label: "文档" },
          { id: "projects", label: "项目" },
        ]}
      />

      <PortalPage id="writing" index={1} total={2} title="博客" description="技术实践 & 生活随笔" action={{ href: "/blog/", label: "更多" }}>
        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <Reveal className="min-w-0">
            {featured ? (
              <FeaturedPost post={featured} />
            ) : (
              <PostList posts={[]} />
            )}
          </Reveal>
          <div className="grid min-w-0 content-start gap-6">
            {recent.length > 0 && (
              <Reveal index={1}>
                <Card>
                  <CardTitle>近期文章</CardTitle>
                  <PostList posts={recent.slice(0, 4)} inset />
                </Card>
              </Reveal>
            )}
            <Reveal index={2}>
              <Card>
                <CardTitle>分类</CardTitle>
                <ul className="flat divide-y divide-edge overflow-hidden rounded-[18px] px-2">
                  {(Object.keys(categories) as Category[]).map((key) => (
                    <li key={key}>
                      <Link
                        href={`/blog/${key}/`}
                        className="group flex min-h-11 items-center gap-3 px-3 py-3"
                      >
                        <span className="flex-1 text-[16px] font-medium text-ink-strong">{categories[key]}</span>
                        <span className="font-mono text-xs text-muted">{posts.filter((p) => p.category === key).length} 篇</span>
                        <CaretRight size={16} weight="bold" className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          </div>
        </div>
      </PortalPage>

      <PortalPage id="projects" index={2} total={2} title="项目" description="参与过的产品" action={{ href: "/projects/", label: "更多" }}>
        <ProjectGrid projects={projects} />
      </PortalPage>
    </>
  );
}
