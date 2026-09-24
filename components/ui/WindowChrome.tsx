// 类 macOS 窗口外框，用来展示代码或产品界面。
export default function WindowChrome({
  title,
  className = "",
  children,
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flat overflow-hidden rounded-[18px] ${className}`}>
      <div className="flex h-10 items-center gap-1.5 px-4">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        {title && <span className="ml-3 truncate font-mono text-[11px] text-muted">{title}</span>}
      </div>
      {children}
    </div>
  );
}
