import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Observation } from "@/models/Observation";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import { Eye, Camera } from "lucide-react";
import React from "react";

import { SummaryCard } from "@/features/dashboard/components/SummaryCard";
import { ManagerSidebar } from "@/features/manajer/components/Dashboard/ManagerSidebar";
import { ManagerHeader } from "@/features/manajer/components/Dashboard/ManagerHeader";
import { PerformanceCharts } from "@/features/manajer/components/Dashboard/PerformanceCharts";
import { LiveObservationTable } from "@/features/manajer/components/Dashboard/LiveObservationTable";
import { AccessControlCard } from "@/features/manajer/components/Petugas/AccessControlCard";
import { ExportReportCard } from "@/features/manajer/components/Laporan/ExportReportCard";
import { MinistryReportCard } from "@/features/manajer/components/Kementrian/MinistryReportCard";

export const runtime = "nodejs";

const getInitials = (name: string) => {
  if (!name) return "M";
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default async function ManagerDashboardPage() {
  // Proteksi Sesi dan Hak Akses Manajer
  const session = await auth();
  const sessionUser = session?.user as any;

  if (!session || sessionUser?.role?.toLowerCase() !== "manajer") {
    redirect("/login");
  }

  // Koneksi ke Database MongoDB
  await connectDB();

  // Ambil Data Utama untuk Ringkasan Card
  const totalPetugas = await User.countDocuments({ role: { $regex: /petugas/i } });
  
  // Menghitung total Pos wilayah unik berdasarkan data lokasi di koleksi Observasi
  const uniqueLocations = await Observation.distinct("lokasi");
  const totalPos = uniqueLocations.length;
  
  // Mengambil entri observasi terbaru berdasarkan tanggal pengamatan lapangan
  const latestObs = await Observation.findOne().sort({ tanggalPengamatan: -1 }).lean() as any;
  const lastActivePetugas = latestObs ? latestObs.namaPetugas || "Petugas Lapangan" : "";

  // Hitung Total Observasi Keseluruhan
  const totalObservations = await Observation.countDocuments();
  
  // Hitung Observasi Khusus Hari Ini secara Dinamis (WIB)
  const nowWIB = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const startOfToday = new Date(nowWIB);
  startOfToday.setHours(0, 0, 0, 0);

  const observationsToday = await Observation.countDocuments({
    tanggalPengamatan: { $gte: startOfToday }
  });
  
  const pendingValidation = totalObservations; 
  
  const today = new Date();
  const lastGeneratedDate = today.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  // Grafik Bergulir Secara Real - Time
  const rollingDays: { name: string; dayIndex: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(nowWIB);
    d.setDate(nowWIB.getDate() - i);
    rollingDays.push({
      name: DAY_NAMES[d.getDay()],
      dayIndex: d.getDay() + 1
    });
  }

  // Ambil data 7 hari terakhir dari database
  const sevenDaysAgo = new Date(nowWIB);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const weeklyRaw = await Observation.aggregate([
    { $match: { tanggalPengamatan: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dayOfWeek: "$tanggalPengamatan" },
        count: { $sum: 1 },
      },
    },
  ]);

  const mongoDataMap = new Map();
  weeklyRaw.forEach(item => {
    mongoDataMap.set(item._id, item.count);
  });

  // Petakan data database ke dalam urutan hari bergulir dinamis
  const weeklyTrends = rollingDays.map((dayObj) => {
    const realCount = mongoDataMap.get(dayObj.dayIndex) || 0;
    return {
      day: dayObj.name,
      count: realCount
    };
  });

  const categoryRaw = await Observation.aggregate([
    { $group: { _id: "$kategori", count: { $sum: 1 } } },
  ]);

  const categoryBreakdown = categoryRaw.map((item) => ({
    name: item._id || "Umum",
    value: item.count,
  }));

  const rawRecentRecords = await Observation.find()
    .sort({ tanggalPengamatan: -1 })
    .limit(5)
    .lean();

  const recentRecords = rawRecentRecords.map((rec: any) => ({
    _id: rec._id.toString(),
    observerName: rec.namaPetugas || "Petugas Lapangan",
    speciesName: rec.namaSatwa || "Tidak Teridentifikasi",
    location: rec.lokasi || "Area TNAP",
    foto: rec.foto || "",
    observedAt: rec.tanggalPengamatan 
      ? new Date(rec.tanggalPengamatan).toLocaleDateString("id-ID") + " | " + (rec.shift || "Pagi")
      : "-",
    status: "Pending" as const, 
  }));

  const realFullName = sessionUser?.fullName || sessionUser?.name || "Manajer Konservasi";
  const realEmail = sessionUser?.email || sessionUser?.username || "manager@alaspurwo.go.id";
  const initials = getInitials(realFullName);
  
  const rawRole = sessionUser?.role || "manajer";
  const formattedRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase() + " Konservasi";

  const managerProfile = {
    fullName: realFullName,
    role: formattedRole,
    avatarInitials: initials,
    email: realEmail,
  };

  return (
    <div className="min-h-screen bg-[#030d08] text-slate-100 antialiased relative">
      <ManagerSidebar currentPath="/dashboard/manajer" user={managerProfile} />

      <div className="px-4 py-4 xl:pl-76 xl:pr-6 xl:py-6 transition-all duration-300">
        <main className="mx-auto max-w-7xl space-y-6">
          
          {/* Header Dashboard */}
          <ManagerHeader user={managerProfile} />

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <SummaryCard 
              title="Total Pengamatan" 
              value={totalObservations} 
              detail="Semua data observasi tersimpan" 
              icon={Eye} 
              accent="from-emerald-500 to-lime-500" 
            />
            <SummaryCard 
              title="Pengamatan Hari Ini" 
              value={observationsToday} 
              detail="Aktivitas tercatat hari ini" 
              icon={Camera} 
              accent="from-amber-500 to-orange-500" 
            />
          </div>

          {/* Grafis responsif */}
          <PerformanceCharts 
            weeklyTrends={weeklyTrends} 
            categoryBreakdown={categoryBreakdown.length > 0 ? categoryBreakdown : [{ name: "Tidak Ada Data", value: 100 }]} 
          />

          {/* Grid Cards responsif */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AccessControlCard 
              totalPetugas={totalPetugas} 
              totalPos={totalPos} 
              lastActivePetugas={lastActivePetugas} 
            />
            <ExportReportCard totalReportReady={totalObservations} lastGeneratedDate={lastGeneratedDate} />
            <MinistryReportCard isSynced={pendingValidation === 0} pendingSyncCount={pendingValidation} lastSyncDate={lastGeneratedDate} />
          </div>

          {/* Tabel data observasi real-time */}
          <LiveObservationTable records={recentRecords} />
        </main>
      </div>
    </div>
  );
}