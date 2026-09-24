import { withBase } from "@/lib/base";
import { site } from "@/lib/site";

// 头像：lib/site.ts 里设置了 avatar 就显示图片，否则显示名字首字母。
export default function Avatar({ size = 64 }: { size?: number }) {
  const initials = site.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${site.avatar ? "" : "border border-edge bg-accent-soft"}`} style={{ width: size, height: size }}>
      {site.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={withBase(site.avatar)} alt={site.name} className="size-full object-cover" />
      ) : (
        <span className="font-semibold text-accent" style={{ fontSize: size * 0.32 }}>
          {initials}
        </span>
      )}
    </span>
  );
}
