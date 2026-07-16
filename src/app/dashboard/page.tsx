import { ClipboardList, Camera, Eye, PlusCircle, Sunrise, Sunset } from "lucide-react";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { RecentObservationTable } from "@/features/dashboard/components/RecentObservationTable";
import { SummaryCard } from "@/features/dashboard/components/SummaryCard";
import { getDashboardData } from "@/app/dashboard/dashboard-data";
import Link from "next/link";

export const runtime = "nodejs";

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
      title: "Sesi Pagi",
      value: stats.morningShift,
      detail: "Pengamatan sesi pagi",
      icon: Sunrise,
      accent: "from-sky-500 to-blue-500",
    },
    {
      title: "Sesi Sore",
      value: stats.eveningShift,
      detail: "Pengamatan sesi sore",
      icon: Sunset,
      accent: "from-orange-500 to-rose-500",
    },
  ];
  return (
    <main className="min-h-screen bg-[#07110c] px-4 py-4 text-slate-100 sm:px-6 lg:px-8 lg:py-6">

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

        

          <div className="mt-2 rounded-[28px] border border-emerald-900/60 bg-[#07110c]/70 p-4 shadow-[0_20px_60px_rgba(2,8,23,0.2)] md:p-6">
            <RecentObservationTable observations={recentObservations} />
          </div>

        </section>
      </div>
    </main>
  );
}
