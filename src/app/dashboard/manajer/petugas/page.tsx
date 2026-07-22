import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import React from "react";

import { ManagerSidebar } from "@/features/manajer/components/Dashboard/ManagerSidebar";
import { ManagerHeader } from "@/features/manajer/components/Dashboard/ManagerHeader";
import { PetugasManagementTable } from "@/features/manajer/components/Petugas/PetugasManagementTable";

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
  // Proteksi Akses Sesi Manajer
  const session = await auth();
  const sessionUser = session?.user as any;

  if (!session || sessionUser?.role?.toLowerCase() !== "manajer") {
    redirect("/login");
  }

  // Ambil Data Petugas dari Database MongoDB
  await connectDB();
  const rawPetugas = await User.find({ role: { $regex: /petugas/i } }).lean();
  
  const daftarPetugas = rawPetugas.map((p: any) => ({
    _id: p._id.toString(),
    fullName: p.fullName,
    username: p.username,
    role: p.role,
  }));

  // Konfigurasi Data Profil Manajer Berdasarkan Login
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
      {/* Sidebar Dinamis */}
      <ManagerSidebar currentPath="/dashboard/manajer/petugas" user={managerProfile} />

      {/* Padding disesuaikan device */}
      <div className="px-4 py-4 xl:pl-76 xl:pr-6 xl:py-6 transition-all duration-300 w-full min-h-screen">
        <main className="mx-auto max-w-7xl space-y-6">
          
          {/* Header Fleksibel */}
          <ManagerHeader 
            title="Kelola Akun Petugas" 
            subtitle="Management Center" 
            user={managerProfile} 
          />

          {/* COMPONENT TABEL UTAMA (Dengan wrapper scroll internal */}
          <PetugasManagementTable initialUsers={daftarPetugas} />

        </main>
      </div>
    </div>
  );
}