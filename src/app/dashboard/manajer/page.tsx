import {
  Users,
  ClipboardCheck,
  TrendingUp,
  CircleAlert,
  CalendarDays,
  Briefcase,
} from "lucide-react";

import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { SummaryCard } from "@/features/dashboard/components/SummaryCard";
import { DashboardCharts } from "@/features/dashboard/components/DashboardCharts";
import { getDashboardData } from "@/app/dashboard/dashboard-data";

export const runtime = "nodejs";

export default async function ManagerDashboard({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }> | { search?: string };
}) {
  const resolvedSearchParams = await searchParams;
  const search =
    typeof resolvedSearchParams.search === "string"
      ? resolvedSearchParams.search
      : "";

  const { user } = await getDashboardData(search);

  const summaryCards = [
    {
      title: "Total Karyawan",
      value: 128,
      detail: "Seluruh divisi",
      icon: Users,
      accent: "from-emerald-500 to-lime-500",
    },
    {
      title: "Approval Pending",
      value: 12,
      detail: "Menunggu persetujuan",
      icon: ClipboardCheck,
      accent: "from-amber-500 to-orange-500",
    },
    {
      title: "Produktivitas",
      value: "91%",
      detail: "Bulan ini",
      icon: TrendingUp,
      accent: "from-emerald-600 to-teal-500",
    },
    {
      title: "Temuan Aktif",
      value: 8,
      detail: "Belum ditindaklanjuti",
      icon: CircleAlert,
      accent: "from-lime-500 to-emerald-600",
    },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,64,38,0.5),_transparent_35%),linear-gradient(135deg,_#07110c_0%,_#0c1914_45%,_#13261d_100%)] px-4 py-4 text-slate-100 sm:px-6 lg:px-8 lg:py-6">

      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row">

        {/* Sidebar */}

        <div className="w-full lg:w-72">
          <DashboardSidebar user={user} />
        </div>

        {/* Content */}

        <section className="flex-1 space-y-4">

          <DashboardHeader
            searchValue={search}
            user={user}
          />

          {/* Summary */}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <SummaryCard key={card.title} {...card} />
            ))}
          </div>

          {/* Charts

          <DashboardCharts
            activity={[
              { day: "Sen", value: 80 },
              { day: "Sel", value: 95 },
              { day: "Rab", value: 72 },
              { day: "Kam", value: 88 },
              { day: "Jum", value: 91 },
            ]}
            categoryBreakdown={[
              { label: "Produksi", value: 42 },
              { label: "Gudang", value: 25 },
              { label: "QC", value: 18 },
              { label: "Admin", value: 15 },
            ]}
          /> */}

          {/* Bottom Grid */}

          <div className="grid gap-4 xl:grid-cols-3">

            {/* Approval */}

            <div className="rounded-[28px] border border-emerald-900/60 bg-[#07110c]/70 p-6 shadow-[0_20px_60px_rgba(2,8,23,0.2)]">

              <h2 className="mb-5 text-lg font-semibold">
                Approval Menunggu
              </h2>

              <div className="space-y-4">

                {[
                  "Pengajuan Cuti",
                  "Laporan Produksi",
                  "Permintaan Barang",
                  "Evaluasi Karyawan",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-xl bg-emerald-950/40 p-4"
                  >
                    <div>
                      <p className="font-medium">{item}</p>
                      <p className="text-sm text-slate-400">
                        Menunggu persetujuan
                      </p>
                    </div>

                    <button className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold hover:bg-emerald-400">
                      Review
                    </button>
                  </div>
                ))}

              </div>
            </div>

            {/* KPI */}

            <div className="rounded-[28px] border border-emerald-900/60 bg-[#07110c]/70 p-6 shadow-[0_20px_60px_rgba(2,8,23,0.2)]">

              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                <TrendingUp size={20} />
                KPI Divisi
              </h2>

              {[
                ["Produksi", 91],
                ["Gudang", 83],
                ["QC", 95],
                ["Administrasi", 75],
              ].map(([name, value]) => (
                <div key={name as string} className="mb-5">

                  <div className="mb-2 flex justify-between text-sm">
                    <span>{name}</span>
                    <span>{value}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-lime-400"
                      style={{ width: `${value}%` }}
                    />
                  </div>

                </div>
              ))}

            </div>

            {/* Agenda */}

            <div className="rounded-[28px] border border-emerald-900/60 bg-[#07110c]/70 p-6 shadow-[0_20px_60px_rgba(2,8,23,0.2)]">

              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
                <CalendarDays size={20} />
                Agenda Hari Ini
              </h2>

              <div className="space-y-5">

                {[
                  ["09.00", "Meeting Divisi"],
                  ["11.00", "Approval Laporan"],
                  ["13.30", "Evaluasi Produksi"],
                  ["15.00", "Monitoring KPI"],
                ].map(([time, title]) => (
                  <div
                    key={time as string}
                    className="flex gap-4 rounded-xl bg-emerald-950/40 p-4"
                  >
                    <div className="font-semibold text-emerald-400">
                      {time}
                    </div>

                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="text-sm text-slate-400">
                        Jadwal Manager
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            </div>

          </div>

          {/* Team Activity */}

          <div className="rounded-[28px] border border-emerald-900/60 bg-[#07110c]/70 p-6 shadow-[0_20px_60px_rgba(2,8,23,0.2)]">

            <div className="mb-5 flex items-center gap-2">

              <Briefcase className="text-emerald-400" />

              <h2 className="text-lg font-semibold">
                Aktivitas Tim Terbaru
              </h2>

            </div>

            <table className="w-full">

              <thead className="text-left text-slate-400">

                <tr>

                  <th className="pb-4">Nama</th>
                  <th className="pb-4">Aktivitas</th>
                  <th className="pb-4">Waktu</th>
                  <th className="pb-4">Status</th>

                </tr>

              </thead>

              <tbody>

                {[
                  ["Budi", "Mengirim Laporan", "08.20", "Selesai"],
                  ["Rina", "Mengajukan Cuti", "09.10", "Pending"],
                  ["Andi", "Upload Data", "10.00", "Selesai"],
                  ["Sinta", "Permintaan Barang", "10.40", "Pending"],
                ].map((row) => (
                  <tr
                    key={row[0]}
                    className="border-t border-emerald-900/40"
                  >
                    <td className="py-4">{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          row[3] === "Pending"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {row[3]}
                      </span>
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>

      </div>

    </main>
  );
}