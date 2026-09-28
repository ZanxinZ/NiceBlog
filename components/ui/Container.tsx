const widths = {
  wide: "max-w-6xl",
  prose: "max-w-3xl",
} as const;

export default function Container({
  size = "wide",
  className = "",
  children,
}: {
  size?: keyof typeof widths;
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`mx-auto w-full ${widths[size]} px-4 sm:px-6 ${className}`}>{children}</div>;
}
