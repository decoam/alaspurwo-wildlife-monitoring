import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import React from "react";

import { ManagerSidebar } from "@/features/manajer/components/ManagerSidebar";
import { ManagerHeader } from "@/features/manajer/components/ManagerHeader";
import { PetugasManagementTable } from "@/features/manajer/components/PetugasManagementTable";

export const runtime = "nodejs";

const getInitials = (name: string) => {
  if (!name) return "M";
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

export default async function KelolaPetugasPage() {
  // 1. Proteksi Akses Sesi Manajer
  const session = await auth();
  const sessionUser = session?.user as any;

  if (!session || sessionUser?.role?.toLowerCase() !== "manajer") {
    redirect("/login");
  }

  // 2. Ambil Data Petugas dari Database MongoDB
  await connectDB();
  const rawPetugas = await User.find({ role: { $regex: /petugas/i } }).lean();
  
  const daftarPetugas = rawPetugas.map((p: any) => ({
    _id: p._id.toString(),
    fullName: p.fullName,
    username: p.username,
    role: p.role,
  }));

  // 3. Konfigurasi Data Profil Manajer Berdasarkan Login
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
    <div className="min-h-screen bg-[#030d08] text-slate-100 antialiased flex">
      {/* SIDEBAR FIXED */}
      <aside className="fixed inset-y-0 left-0 w-72 z-20">
        <ManagerSidebar currentPath="/dashboard/manajer/petugas" user={managerProfile} />
      </aside>

      {/* AREA UTAMA (Scrollable) */}
      <div className="pl-72 pr-6 py-6 w-full min-h-screen overflow-y-auto">
        <main className="mx-auto max-w-7xl space-y-6">
          
          {/* 🟢 MEMANGGIL COMPONENT HEADER ASLI SECARA DINAMIS */}
          <ManagerHeader 
            title="Kelola Akun Petugas" 
            subtitle="Management Center" 
            user={managerProfile} 
          />

          {/* COMPONENT TABEL UTAMA (Memegang judul tabel, deskripsi card, dan search internal) */}
          <PetugasManagementTable initialUsers={daftarPetugas} />

        </main>
      </div>
    </div>
  );
}