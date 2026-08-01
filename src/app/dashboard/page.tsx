import { auth } from "@/auth";
import { redirect } from "next/navigation";
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
  // PERBAIKAN: Guard auth() eksplisit di Server Component
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : "";

  const { stats, recentObservations, user } = await getDashboardData(search);

  const summaryCards = [
    {
      title: "Total Pengamatan",
      value: stats.totalObservations,
      detail: "Semua data observasi tersimpan",
      icon: Eye,
      accent: "from-brand-hover to-lime-500",
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
    <main className="min-h-screen bg-surface-bg px-4 py-4 text-text-light sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row">
        <div className="hidden w-72 shrink-0 md:block">
          <DashboardSidebar user={user} />
        </div>

        <section className="min-w-0 flex-1 space-y-4">
          <DashboardHeader searchValue={search} user={user} />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <SummaryCard key={card.title} {...card} />
            ))}
          </div>

          <div className="mt-2 rounded-[28px] border border-brand-primary/60 bg-surface-bg/70 p-4 shadow-card md:p-6">
            <RecentObservationTable observations={recentObservations} />
          </div>
        </section>
      </div>
    </main>
  );
}