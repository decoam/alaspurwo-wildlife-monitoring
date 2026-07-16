import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Observation } from "@/models/Observation";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import React from "react";

import { ManagerSidebar } from "@/features/manajer/components/ManagerSidebar";
import { ManagerHeader } from "@/features/manajer/components/ManagerHeader";
import { PerformanceCharts } from "@/features/manajer/components/PerformanceCharts";
import { LiveObservationTable } from "@/features/manajer/components/LiveObservationTable";
import { AccessControlCard } from "@/features/manajer/components/AccessControlCard";
import { ExportReportCard } from "@/features/manajer/components/ExportReportCard";
import { MinistryReportCard } from "@/features/manajer/components/MinistryReportCard";

export const runtime = "nodejs";

const getInitials = (name: string) => {
  if (!name) return "M";
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

export default async function ManagerDashboardPage() {
  // 1. Proteksi Sesi dan Hak Akses Manajer
  const session = await auth();
  const sessionUser = session?.user as any;

  if (!session || sessionUser?.role?.toLowerCase() !== "manajer") {
    redirect("/login");
  }

  // 2. Hubungkan ke Database MongoDB
  await connectDB();

  // 3. Tarik Data Utama untuk Ringkasan Card
  const totalPetugas = await User.countDocuments({ role: { $regex: /petugas/i } });
  
  // 🟢 SEKARANG DINAMIS: Menghitung total Pos wilayah unik berdasarkan data lokasi di koleksi Observasi
  const uniqueLocations = await Observation.distinct("lokasi");
  const totalPos = uniqueLocations.length;
  
  // Mengambil entri observasi terbaru berdasarkan tanggal pengamatan lapangan
  const latestObs = await Observation.findOne().sort({ tanggalPengamatan: -1 }).lean() as any;
  // Jika tidak ada data, kosongkan string ("") agar memicu teks fallback bawaan di AccessControlCard
  const lastActivePetugas = latestObs ? latestObs.namaPetugas || "Petugas Lapangan" : "";

  const totalObservations = await Observation.countDocuments();
  
  // Karena di skema belum ada field status, kita hitung data yang tersimpan secara global
  const pendingValidation = totalObservations; 
  
  const today = new Date();
  const lastGeneratedDate = today.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  const targetDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const jsDayMapping: { [key: string]: number } = {
    "Minggu": 0, "Senin": 1, "Selasa": 2, "Rabu": 3, "Kamis": 4, "Jumat": 5, "Sabtu": 6
  };

  // Kueri Agregasi Riil disesuaikan dengan field skema: 'tanggalPengamatan'
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const weeklyRaw = await Observation.aggregate([
    { $match: { tanggalPengamatan: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dayOfWeek: "$tanggalPengamatan" }, // MongoDB: 1 (Minggu) s/d 7 (Sabtu)
        count: { $sum: 1 },
      },
    },
  ]);

  const mongoDataMap = new Map();
  weeklyRaw.forEach(item => {
    mongoDataMap.set(item._id, item.count);
  });

  // Mapping urutan kaku Senin -> Minggu. Jika hari kosong = 0 (bukan data tiruan)
  const weeklyTrends = targetDays.map((dayName) => {
    const jsDayIndex = jsDayMapping[dayName];
    const mongoDayIndex = jsDayIndex + 1;
    const realCount = mongoDataMap.get(mongoDayIndex) || 0;

    return {
      day: dayName,
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

  // DATA DINAMIS DARI DATABASE & SESI LOGIN
  const realFullName = sessionUser?.fullName || sessionUser?.name || "Manajer Konservasi";
  const realEmail = sessionUser?.email || sessionUser?.username || "manager@alaspurwo.go.id";
  const initials = getInitials(realFullName);
  
  // Format role agar kapital di awal (contoh: "manajer" -> "Manajer Konservasi")
  const rawRole = sessionUser?.role || "manajer";
  const formattedRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase() + " Konservasi";

  const managerProfile = {
    fullName: realFullName,
    role: formattedRole,
    avatarInitials: initials,
    email: realEmail,
  };

  return (
    <div className="min-h-screen bg-[#030d08] text-slate-100 antialiased">
      {/* Sidebar otomatis menggunakan profile asli */}
      <ManagerSidebar currentPath="/dashboard/manajer" user={managerProfile} />

      <div className="pl-72 pr-6 py-6">
        <main className="mx-auto max-w-7xl space-y-6">
          {/* Header otomatis menggunakan profile asli */}
          <ManagerHeader user={managerProfile} />

          <PerformanceCharts 
            weeklyTrends={weeklyTrends} 
            categoryBreakdown={categoryBreakdown.length > 0 ? categoryBreakdown : [{ name: "Tidak Ada Data", value: 100 }]} 
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 🟢 SEKARANG SEPENUHNYA DINAMIS: Passing properti totalPos dari database */}
            <AccessControlCard 
              totalPetugas={totalPetugas} 
              totalPos={totalPos} 
              lastActivePetugas={lastActivePetugas} 
            />
            <ExportReportCard totalReportReady={totalObservations} lastGeneratedDate={lastGeneratedDate} />
            <MinistryReportCard isSynced={pendingValidation === 0} pendingSyncCount={pendingValidation} lastSyncDate={lastGeneratedDate} />
          </div>

          <LiveObservationTable records={recentRecords} />
        </main>
      </div>
    </div>
  );
}