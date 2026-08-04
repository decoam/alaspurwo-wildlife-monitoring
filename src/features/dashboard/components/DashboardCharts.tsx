"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ActivityPoint = {
  day: string;
  count: number;
};

type CategoryPoint = {
  name: string;
  value: number;
};

type DashboardChartsProps = {
  activity: ActivityPoint[];
  categoryBreakdown: CategoryPoint[];
};

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export function DashboardCharts({ activity, categoryBreakdown }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
      <div className="rounded-[28px] border border-brand-primary/60 bg-surface-bg/70 p-4 shadow-card md:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-text-heading">Aktivitas Mingguan</h2>
          <p className="mt-1 text-sm text-text-muted">Jumlah pengamatan yang tercatat dalam 7 hari terakhir.</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activity}>
              <CartesianGrid stroke="var(--color-surface-border)" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
              <YAxis tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="var(--color-chart-1)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[28px] border border-brand-primary/60 bg-surface-bg/70 p-4 shadow-card md:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-text-heading">Kategori Satwa</h2>
          <p className="mt-1 text-sm text-text-muted">Distribusi pengamatan berdasarkan kategori.</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
