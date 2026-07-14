import { type LucideIcon } from "lucide-react";

type SummaryCardProps = {
  title: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  accent: string;
};

export function SummaryCard({ title, value, detail, icon: Icon, accent }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-emerald-900/60 bg-[#0c1914]/90 p-5 shadow-[0_20px_60px_rgba(2,8,23,0.25)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-200/80">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-400">{detail}</p>
        </div>
        <div className={`rounded-2xl bg-linear-to-br ${accent} p-3 text-white shadow-lg`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
