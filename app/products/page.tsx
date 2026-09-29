import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";
import Container from "@/components/ui/Container";
import PageHeader from "@/components/ui/PageHeader";
import { getProducts } from "@/lib/projects";

export const metadata: Metadata = { title: "产品" };

export default function Products() {
  return (
    <Container className="pb-8">
      <PageHeader eyebrow="Products" />
      <ProjectGrid projects={getProducts()} hrefBase="/products/" emptyDir="content/products/" emptyTitle="还没有产品" horizontal />
    </Container>
  );
}
