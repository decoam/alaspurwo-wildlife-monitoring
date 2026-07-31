"use client";

import React from "react";
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
import { BarChart2, PieChart as PieChartIcon } from "lucide-react";

interface ChartDataPoint {
  day: string;
  count: number;
}

interface CategoryDataPoint {
  name: string;
  value: number;
}

interface PerformanceChartsProps {
  weeklyTrends?: ChartDataPoint[];
  categoryBreakdown?: CategoryDataPoint[];
}

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  weeklyTrends = [],
  categoryBreakdown = [],
}) => {
  // Cek apakah data kosong atau total nilainya 0
  const isWeeklyTrendsEmpty =
    weeklyTrends.length === 0 ||
    weeklyTrends.every((item) => item.count === 0);

  const isCategoryBreakdownEmpty =
    categoryBreakdown.length === 0 ||
    categoryBreakdown.every((item) => item.value === 0);

  // Mencari nilai tertinggi untuk menentukan tickCount yang dinamis namun tetap bulat
  const maxCount = weeklyTrends.length > 0 ? Math.max(...weeklyTrends.map((d) => d.count), 0) : 0;
  // Jika maxCount kurang dari 4, set tickCount menjadi maxCount + 1 agar pas
  const calculatedTickCount = maxCount < 4 ? maxCount + 1 : undefined;

  return (
    <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
      {/* 1. Grafik Batang: Aktivitas Mingguan */}
      <div className="flex flex-col justify-between rounded-[28px] border border-brand-primary/60 bg-surface-bg/70 p-4 shadow-card md:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-text-heading">Aktivitas Mingguan</h2>
          <p className="mt-1 text-sm text-text-muted">
            Jumlah pengamatan yang tercatat dalam 7 hari terakhir.
          </p>
        </div>
        <div className="h-64 flex items-center justify-center">
          {isWeeklyTrendsEmpty ? (
            <div className="flex flex-col items-center justify-center text-center text-text-muted space-y-2">
              <BarChart2 className="w-10 h-10 stroke-[1.5] text-chart-2/80" />
              <p className="text-xs">Belum ada data aktivitas minggu ini</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrends}>
                  <CartesianGrid stroke="var(--color-surface-border)" strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
                  
                  {/* Supaya tampil bilangan bulat bukan desimal */}
                  <YAxis 
                    tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} 
                    allowDecimals={false}
                    tickCount={calculatedTickCount}
                  />
                  
                  <Tooltip 
                    contentStyle={{ backgroundColor: "var(--color-surface-bg)", borderColor: "var(--color-brand-primary)", borderRadius: "12px" }}
                    labelStyle={{ color: "var(--color-chart-1)", fontWeight: "bold" }}
                    itemStyle={{ color: "var(--color-text-heading)" }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="var(--color-chart-1)" />
                </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 2. Grafik Lingkaran: Kategori Satwa */}
      <div className="flex flex-col justify-between rounded-[28px] border border-brand-primary/60 bg-surface-bg/70 p-4 shadow-card md:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-text-heading">Kategori Satwa</h2>
          <p className="mt-1 text-sm text-text-muted">
            Distribusi pengamatan berdasarkan kategori.
          </p>
        </div>
        <div className="h-64 flex items-center justify-center">
          {isCategoryBreakdownEmpty ? (
            <div className="flex flex-col items-center justify-center text-center text-text-muted space-y-2">
              <PieChartIcon className="w-10 h-10 stroke-[1.5] text-chart-4/80" />
              <p className="text-xs">Belum ada data kategori satwa</p>
            </div>
          ) : (
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
                    <Cell 
                      key={`${entry.name}-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--color-surface-bg)", borderColor: "var(--color-brand-primary)", borderRadius: "12px" }}
                  labelStyle={{ color: "var(--color-chart-1)", fontWeight: "bold" }}
                  itemStyle={{ color: "var(--color-text-heading)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};