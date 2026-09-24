const tones = {
  neutral: "bg-subtle text-muted",
  red: "bg-red-bg text-red-fg",
  blue: "bg-blue-bg text-blue-fg",
  green: "bg-green-bg text-green-fg",
  yellow: "bg-yellow-bg text-yellow-fg",
} as const;

export type Tone = keyof typeof tones;

export default function Tag({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.05em] ${tones[tone]}`}>
      {children}
    </span>
  );
}
