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

const COLORS = ["#34d399", "#f59e0b", "#38bdf8", "#a78bfa", "#fb7185"];

export function DashboardCharts({ activity, categoryBreakdown }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
      <div className="rounded-[28px] border border-emerald-900/60 bg-[#07110c]/70 p-4 shadow-[0_20px_60px_rgba(2,8,23,0.2)] md:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Aktivitas Mingguan</h2>
          <p className="mt-1 text-sm text-slate-400">Jumlah pengamatan yang tercatat dalam 7 hari terakhir.</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activity}>
              <CartesianGrid stroke="#1f3b2d" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
              <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[28px] border border-emerald-900/60 bg-[#07110c]/70 p-4 shadow-[0_20px_60px_rgba(2,8,23,0.2)] md:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Kategori Satwa</h2>
          <p className="mt-1 text-sm text-slate-400">Distribusi pengamatan berdasarkan kategori.</p>
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
