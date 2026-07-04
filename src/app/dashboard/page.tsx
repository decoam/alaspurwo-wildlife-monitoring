import { Camera, Eye, Leaf, TrendingUp } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export const runtime = "nodejs";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { RecentObservationTable } from "@/components/dashboard/RecentObservationTable";
import { SummaryCard } from "@/components/dashboard/SummaryCard";

const summaryCards = [
  {
    title: "Total Pengamatan",
    value: "128",
    detail: "+12% dari bulan lalu",
    icon: Eye,
    accent: "from-emerald-500 to-lime-500",
  },
  {
    title: "Pengamatan Hari Ini",
    value: "19",
    detail: "Aktivitas tercatat 06:00 - 18:00",
    icon: Camera,
    accent: "from-amber-500 to-orange-500",
  },
  {
    title: "Jumlah Spesies",
    value: "34",
    detail: "8 spesies baru dipantau",
    icon: Leaf,
    accent: "from-emerald-600 to-teal-500",
  },
  {
    title: "Upload Hari Ini",
    value: "11",
    detail: "Foto dan video terbaru",
    icon: TrendingUp,
    accent: "from-lime-500 to-emerald-600",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,64,38,0.5),_transparent_35%),linear-gradient(135deg,_#07110c_0%,_#0c1914_45%,_#13261d_100%)] px-4 py-4 text-slate-100 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-72">
          <DashboardSidebar />
        </div>

        <section className="flex-1 space-y-4">
          <DashboardHeader />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <SummaryCard key={card.title} {...card} />
            ))}
          </div>

          <div className="rounded-[28px] border border-emerald-900/60 bg-[#07110c]/70 p-4 shadow-[0_20px_60px_rgba(2,8,23,0.2)] md:p-6">
            <RecentObservationTable />
          </div>
        </section>
      </div>
    </main>
  );
}
