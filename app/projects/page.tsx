import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = { title: "项目" };

export default function Projects() {
  return (
    <Container className="pb-8">
      <PageHeader eyebrow="Projects" />
      <ProjectGrid projects={getProjects()} />
    </Container>
  );
}
