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

const COLORS = ["#34d399", "#f59e0b", "#38bdf8", "#a78bfa", "#fb7185"];

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
      <div className="flex flex-col justify-between rounded-[28px] border border-emerald-900/60 bg-[#07110c]/70 p-4 shadow-[0_20px_60px_rgba(2,8,23,0.2)] md:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Aktivitas Mingguan</h2>
          <p className="mt-1 text-sm text-slate-400">
            Jumlah pengamatan yang tercatat dalam 7 hari terakhir.
          </p>
        </div>
        <div className="h-64 flex items-center justify-center">
          {isWeeklyTrendsEmpty ? (
            <div className="flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
              <BarChart2 className="w-10 h-10 stroke-[1.5] text-emerald-900/80" />
              <p className="text-xs">Belum ada data aktivitas minggu ini</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrends}>
                <CartesianGrid stroke="#1f3b2d" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                
                {/* Supaya tampil bilangan bulat bukan desimal */}
                <YAxis 
                  tick={{ fill: "#cbd5e1", fontSize: 12 }} 
                  allowDecimals={false}
                  tickCount={calculatedTickCount}
                />
                
                <Tooltip 
                  contentStyle={{ backgroundColor: "#040a07", borderColor: "#064e3b", borderRadius: "12px" }}
                  labelStyle={{ color: "#34d399", fontWeight: "bold" }}
                  itemStyle={{ color: "#f8fafc" }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 2. Grafik Lingkaran: Kategori Satwa */}
      <div className="flex flex-col justify-between rounded-[28px] border border-emerald-900/60 bg-[#07110c]/70 p-4 shadow-[0_20px_60px_rgba(2,8,23,0.2)] md:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Kategori Satwa</h2>
          <p className="mt-1 text-sm text-slate-400">
            Distribusi pengamatan berdasarkan kategori.
          </p>
        </div>
        <div className="h-64 flex items-center justify-center">
          {isCategoryBreakdownEmpty ? (
            <div className="flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
              <PieChartIcon className="w-10 h-10 stroke-[1.5] text-emerald-900/80" />
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
                  contentStyle={{ backgroundColor: "#040a07", borderColor: "#064e3b", borderRadius: "12px" }}
                  labelStyle={{ color: "#34d399", fontWeight: "bold" }}
                  itemStyle={{ color: "#f8fafc" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};