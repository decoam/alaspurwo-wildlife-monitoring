import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Observation } from "@/models/Observation"; // Sesuaikan nama model data kamu
import { redirect } from "next/navigation";
import React from "react";

import { ManagerSidebar } from "@/features/manajer/components/ManagerSidebar";
import { ManagerHeader } from "@/features/manajer/components/ManagerHeader";
import { ManagerObservationTable } from "@/features/manajer/components/ManagerObservationTable";

export const runtime = "nodejs";

const getInitials = (name: string) => {
  if (!name) return "M";
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

export default async function ManajerHistoriPage() {
  // 1. Proteksi Akses Sesi Manajer
  const session = await auth();
  const sessionUser = session?.user as any;

  if (!session || sessionUser?.role?.toLowerCase() !== "manajer") {
    redirect("/login");
  }

  // 2. Ambil Data Riwayat Observasi dari MongoDB
  await connectDB();
  const rawObservations = await Observation.find({}).sort({ createdAt: -1 }).lean();
  
  const daftarObservasi = rawObservations.map((obs: any) => ({
    _id: obs._id.toString(),
    namaSatwa: obs.namaSatwa || "Tidak Diketahui",
    kategori: obs.kategori || "Mamalia",
    jumlah: obs.jumlah || 1,
    lokasi: obs.lokasi || "Sadengan",
    shift: obs.shift || "Pagi",
    tanggalPengamatan: obs.tanggalPengamatan ? obs.tanggalPengamatan.toISOString() : new Date().toISOString(),
    foto: obs.foto || "",
    namaPetugas: obs.namaPetugas || "Petugas Lapangan",
    kondisiCuaca: obs.kondisiCuaca || "Cerah",
    posPengamatan: obs.posPengamatan || obs.lokasi,
    catatan: obs.catatan || "",
    aktivitasSatwa: obs.aktivitasSatwa || "",
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
    <div className="min-h-screen bg-[#030d08] text-slate-100 antialiased relative">
      {/* Sidebar Dinamis Tetap */}
      <ManagerSidebar currentPath="/dashboard/manajer/histori" user={managerProfile} />

      {/* Konten Fleksibel dengan padding mengikuti device */}
      <div className="px-4 py-4 xl:pl-76 xl:pr-6 xl:py-6 transition-all duration-300 w-full min-h-screen">
        <main className="mx-auto max-w-7xl space-y-6">
          
          {/* Header Dinamis Khusus Halaman Histori */}
          <ManagerHeader 
            title="Detail & Riwayat Laporan Lapangan" 
            subtitle="Monitoring Center" 
            user={managerProfile} 
          />

          {/* Tabel Utama Versi View-Only Manajer */}
          <ManagerObservationTable items={daftarObservasi} />

        </main>
      </div>
    </div>
  );
}