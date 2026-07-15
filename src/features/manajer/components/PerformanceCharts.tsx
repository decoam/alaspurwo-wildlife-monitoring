"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Warna grafik diselaraskan dengan tema Alas Purwo
const COLORS = ["#10b981", "#06b6d4", "#f59e0b", "#ef4444"];

interface ChartDataPoint {
  day: string;
  count: number;
}

interface CategoryDataPoint {
  name: string;
  value: number;
}

interface PerformanceChartsProps {
  weeklyTrends: ChartDataPoint[];
  categoryBreakdown: CategoryDataPoint[];
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  weeklyTrends,
  categoryBreakdown,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      
      {/* 1. Grafik Batang: Tren Observasi Mingguan (Mengambil 2 Kolom Grid) */}
      <div className="rounded-3xl border border-emerald-900/40 bg-[#07110c]/50 p-6 shadow-md lg:col-span-2">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-200">
            Tren Intensitas Observasi
          </h3>
          <p className="text-xs text-slate-500">
            Jumlah aktivitas laporan satwa liar masuk per hari
          </p>
        </div>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#064e3b/20" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#040a07", borderColor: "#064e3b" }}
                labelStyle={{ color: "#10b981" }}
                itemStyle={{ color: "#f8fafc" }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Grafik Lingkaran: Breakdown Kategori Satwa (Mengambil 1 Kolom Grid) */}
      <div className="rounded-3xl border border-emerald-900/40 bg-[#07110c]/50 p-6 shadow-md">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-200">
            Komposisi Kelas Satwa
          </h3>
          <p className="text-xs text-slate-500">
            Persentase temuan berdasarkan ordo taksonomi
          </p>
        </div>

        <div className="relative flex h-72 flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#040a07", borderColor: "#064e3b" }}
                itemStyle={{ color: "#f8fafc" }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legenda Custom di Bawah Pie Chart */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
            {categoryBreakdown.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span 
                  className="h-2.5 w-2.5 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                />
                <span className="text-slate-400">{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};