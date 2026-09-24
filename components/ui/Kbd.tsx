export default function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="flat inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1 font-mono text-[11px] leading-none text-muted">
      {children}
    </kbd>
  );
}
