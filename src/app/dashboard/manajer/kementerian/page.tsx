import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Observation } from "@/models/Observation";
import { redirect } from "next/navigation";
import React from "react";

import { ManagerSidebar } from "@/features/manajer/components/ManagerSidebar";
import { ManagerHeader } from "@/features/manajer/components/ManagerHeader";
import { MinistryReportCenter } from "@/features/manajer/components/MinistryReportCenter";

// Memastikan halaman selalu mengambil data observasi terbaru tanpa stale cache
export const revalidate = 0;

const getInitials = (name: string) => {
  if (!name) return "M";
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

export default async function ManajerLaporanKementerianPage() {
  // 1. Proteksi Akses Sesi Manajer
  const session = await auth();
  const sessionUser = session?.user as any;

  if (!session || sessionUser?.role?.toLowerCase() !== "manajer") {
    redirect("/login");
  }

  // 2. Koneksi DB & Ambil Data Observasi Riil
  await connectDB();
  const rawObservations = await Observation.find({}).sort({ tanggalPengamatan: -1 }).lean();
  
  // Mapping data riil lapangan
  const daftarObservasi = rawObservations.map((obs: any) => ({
    _id: obs._id.toString(),
    namaSatwa: obs.namaSatwa || "Tidak Diketahui",
    kategori: obs.kategori || "Mamalia",
    jumlah: Number(obs.jumlah) || 1,
    lokasi: obs.lokasi || "Sadengan",
    shift: obs.shift || "Pagi",
    tanggalPengamatan: obs.tanggalPengamatan ? obs.tanggalPengamatan.toISOString() : new Date().toISOString(),
    foto: obs.foto || "",
    namaPetugas: obs.namaPetugas || "Petugas Lapangan",
    kondisiCuaca: obs.kondisiCuaca || "Cerah",
    posPengamatan: obs.posPengamatan || obs.lokasi || "Sadengan",
    catatan: obs.catatan || "",
    aktivitasSatwa: obs.aktivitasSatwa || obs.catatan || "",
  }));

  // 3. Konfigurasi Profil Manajer untuk Sidebar & Header
  const realFullName = sessionUser?.fullName || sessionUser?.name || "Manajer Konservasi";
  const realUsername = sessionUser?.username || "manager_tnap";
  const initials = getInitials(realFullName);
  const rawRole = sessionUser?.role || "manajer";
  const formattedRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase() + " Konservasi";

  const managerProfile = {
    fullName: realFullName,
    role: formattedRole,
    avatarInitials: initials,
    email: "@" + realUsername,
  };

  return (
    <div className="min-h-screen bg-[#030d08] text-slate-100 antialiased relative print:bg-white print:text-black">
      
      {/* Sidebar Aktif sesuai path kementerian */}
      <div className="print:hidden">
        <ManagerSidebar currentPath="/dashboard/manajer/kementerian" user={managerProfile} />
      </div>

      <div className="px-4 py-4 xl:pl-76 xl:pr-6 xl:py-6 transition-all duration-300 w-full min-h-screen print:p-0 print:m-0">
        <main className="mx-auto max-w-7xl space-y-6 print:max-w-full print:p-0">
          
          <div className="print:hidden">
            <ManagerHeader 
              title="Pelaporan Kementerian LHK" 
              subtitle="Pusat Kepatuhan Kehati & Validasi Dokumen Negara" 
              user={managerProfile} 
            />
          </div>

          {/* Pemisahan UI Komponen Utama */}
          <div className="rounded-3xl border border-emerald-900/40 bg-[#0c1914]/40 shadow-[0_20px_50px_rgba(2,8,23,0.4)] overflow-hidden print:border-none print:bg-transparent print:shadow-none print:rounded-none">
            <MinistryReportCenter initialReports={daftarObservasi} />
          </div>

        </main>
      </div>
    </div>
  );
}