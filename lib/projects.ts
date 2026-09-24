import path from "node:path";
import { CONTENT_DIR, findMdx, listMdx, num, readMdx, str, stripExt, strList } from "./content";
import type { Tone } from "@/components/ui/Tag";

export type ProjectLink = { label: string; href: string };

export type ProjectMeta = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  role: string;
  status: string;
  tone: Tone;
  stack: string[];
  links: ProjectLink[];
  cover: string;
  preview: string;
  previewTitle: string;
  featured: boolean;
  order: number;
  draft: boolean;
};

export type Project = ProjectMeta & { content: string };

const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");
const tones: Tone[] = ["neutral", "red", "blue", "green", "yellow"];

function readProject(file: string): Project {
  const { data, content } = readMdx(file);
  const links = Array.isArray(data.links)
    ? data.links.map((l: Record<string, unknown>) => ({ label: str(l.label), href: str(l.href) }))
    : [];
  const tone = str(data.tone, "neutral") as Tone;

  return {
    slug: stripExt(path.basename(file)),
    title: str(data.title, path.basename(file)),
    summary: str(data.summary),
    year: str(data.year),
    role: str(data.role),
    status: str(data.status),
    tone: tones.includes(tone) ? tone : "neutral",
    stack: strList(data.stack),
    links,
    cover: str(data.cover),
    preview: str(data.preview).trimEnd(),
    previewTitle: str(data.previewTitle),
    featured: Boolean(data.featured),
    order: num(data.order, 100),
    draft: Boolean(data.draft),
    content,
  };
}

// 排序：order 小的在前，其次按年份倒序。
export function getProjects(): ProjectMeta[] {
  return listMdx(PROJECTS_DIR)
    .map((f) => readProject(path.join(PROJECTS_DIR, f)))
    .filter((p) => !p.draft)
    .sort((a, b) => a.order - b.order || b.year.localeCompare(a.year))
    .map(({ content: _content, ...meta }) => meta);
}

export function getProject(slug: string): Project | null {
  const file = findMdx(path.join(PROJECTS_DIR, slug));
  return file ? readProject(file) : null;
}
