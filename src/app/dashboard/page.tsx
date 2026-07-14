import { Camera, Eye, Leaf, TrendingUp } from "lucide-react";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";

export const runtime = "nodejs";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { RecentObservationTable } from "@/features/dashboard/components/RecentObservationTable";
import { SummaryCard } from "@/features/dashboard/components/SummaryCard";
import { DashboardCharts } from "@/features/dashboard/components/DashboardCharts";
import { getDashboardData } from "@/app/dashboard/dashboard-data";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }> | { search?: string };
}) {
  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : "";
  const { stats, recentObservations, user } = await getDashboardData(search);

  const summaryCards = [
    {
      title: "Total Pengamatan",
      value: stats.totalObservations,
      detail: "Semua data observasi tersimpan",
      icon: Eye,
      accent: "from-emerald-500 to-lime-500",
    },
    {
      title: "Pengamatan Hari Ini",
      value: stats.observationsToday,
      detail: "Aktivitas tercatat hari ini",
      icon: Camera,
      accent: "from-amber-500 to-orange-500",
    },
    {
      title: "Jumlah Spesies",
      value: stats.uniqueSpecies,
      detail: "Spesies tercatat saat ini",
      icon: Leaf,
      accent: "from-emerald-600 to-teal-500",
    },
    {
      title: "Upload Hari Ini",
      value: stats.uploadsToday,
      detail: "Foto dan video terbaru",
      icon: TrendingUp,
      accent: "from-lime-500 to-emerald-600",
    },
  ];
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,64,38,0.5),_transparent_35%),linear-gradient(135deg,_#07110c_0%,_#0c1914_45%,_#13261d_100%)] px-4 py-4 text-slate-100 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-72">
          <DashboardSidebar user={user} />
        </div>

        <section className="flex-1 space-y-4">
          <DashboardHeader searchValue={search} user={user} />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <SummaryCard key={card.title} {...card} />
            ))}
          </div>

          <DashboardCharts activity={stats.weeklyActivity} categoryBreakdown={stats.categoryBreakdown} />

          <div className="rounded-[28px] border border-emerald-900/60 bg-[#07110c]/70 p-4 shadow-[0_20px_60px_rgba(2,8,23,0.2)] md:p-6">
            <RecentObservationTable observations={recentObservations} />
          </div>
        </section>
      </div>
    </main>
  );
}
