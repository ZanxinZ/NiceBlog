import { Image as ImageIcon } from "@phosphor-icons/react/dist/ssr";
import { withBase } from "@/lib/base";

const ratios = {
  "16/10": "aspect-[16/10]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
} as const;

// 扁平的图片容器。有 src 时只显示图片（无边框）；没有时显示带描边的占位，并提示图片放在哪里。
export default function ImageFrame({
  src,
  alt = "",
  ratio = "16/10",
  hint = "封面图位置",
  compact = false,
  className = "",
}: {
  src?: string;
  alt?: string;
  ratio?: keyof typeof ratios;
  hint?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={`${src ? "" : "flat"} overflow-hidden ${compact ? "rounded-[12px]" : "rounded-[18px]"} ${ratios[ratio]} ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={withBase(src)} alt={alt} loading="lazy" className="size-full object-cover" />
      ) : (
        <div className="bg-dots flex size-full flex-col items-center justify-center gap-3 text-center">
          <span className={`flex items-center justify-center rounded-full border border-edge bg-surface text-muted ${compact ? "size-8" : "size-12"}`}>
            <ImageIcon size={compact ? 16 : 22} weight="bold" />
          </span>
          {!compact && <span className="px-4 text-xs text-muted">{hint}</span>}
        </div>
      )}
    </div>
  );
}
