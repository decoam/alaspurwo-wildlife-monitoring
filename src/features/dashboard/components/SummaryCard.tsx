import { type LucideIcon } from "lucide-react";

type SummaryCardProps = {
  title: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  accent: string;
  iconColor?: string;
};

export function SummaryCard({ title, value, detail, icon: Icon, accent, iconColor = "text-text-heading" }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-brand-primary/60 bg-surface-subtle/90 p-5 shadow-card-bright backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand-text-light/80">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-text-heading">{value}</p>
          <p className="mt-2 text-sm text-text-muted">{detail}</p>
        </div>
        <div className={`rounded-2xl bg-linear-to-br ${accent} p-3 shadow-lg`}>
          <Icon className={`h-5 w-5 ${iconColor} drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]`} />
        </div>
      </div>
    </div>
  );
}
