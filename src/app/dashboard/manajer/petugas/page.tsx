import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";
import { UserPlus, Edit2, Trash2 } from "lucide-react";

import { ManagerSidebar } from "@/features/manajer/components/ManagerSidebar";
import { ManagerHeader } from "@/features/manajer/components/ManagerHeader";

export const runtime = "nodejs";

// Helper inisial nama
const getInitials = (name: string) => {
  if (!name) return "M";
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

export default async function KelolaPetugasPage() {
  // 1. Proteksi Akses Manajer
  const session = await auth();
  const sessionUser = session?.user as any;

  if (!session || sessionUser?.role?.toLowerCase() !== "manajer") {
    redirect("/login");
  }

  // 2. Ambil Data Petugas dari MongoDB
  await connectDB();
  const rawPetugas = await User.find({ role: { $regex: /petugas/i } }).lean();
  
  const daftarPetugas = rawPetugas.map((p: any) => ({
    _id: p._id.toString(),
    fullName: p.fullName,
    username: p.username,
    role: p.role,
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
    <div className="min-h-screen bg-[#030d08] text-slate-100 antialiased flex">
      {/* SIDEBAR FIXED (Tidak ikut bergeser saat main di-scroll) */}
      <aside className="fixed inset-y-0 left-0 w-7xl z-20">
        <ManagerSidebar currentPath="/dashboard/manajer/petugas" user={managerProfile} />
      </aside>

      {/* AREA UTAMA (Bisa di-scroll mandiri) */}
      <div className="pl-72 pr-6 py-6 w-full min-h-screen overflow-y-auto">
        <main className="mx-auto max-w-7xl space-y-6">
          
          {/* HEADER UTAMA */}
          <ManagerHeader user={managerProfile} />

          {/* Bagian Atas: Judul dan Tombol Tambah ke /register */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-white">Kelola Akun Petugas</h2>
              <p className="text-sm text-slate-400 mt-1">Daftar personel lapangan aktif di area TN Alas Purwo.</p>
            </div>
            
            {/* Tombol yang mengarah ke halaman register terpisah */}
            <Link
              href="/dashboard/manajer/petugas/register"
              className="flex items-center gap-2 rounded-2xl bg-linear-to-r from-emerald-600 to-lime-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-emerald-500 hover:to-lime-500 shadow-md"
            >
              <UserPlus className="h-4 w-4" />
              Tambah Petugas Baru
            </Link>
          </div>

          {/* Tabel Daftar Petugas Sederhana (Untuk Edit & Delete nanti kita integrasikan Modal di Step Selanjutnya) */}
          <div className="overflow-hidden rounded-[28px] border border-emerald-900/60 bg-[#0c1914]/85 shadow-xl">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#10241a] text-xs font-semibold uppercase tracking-wider text-emerald-400 border-b border-emerald-900/60">
                <tr>
                  <th className="px-6 py-4">Nama Lengkap</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Hak Akses</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/40">
                {daftarPetugas.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                      Belum ada data petugas lapangan terdaftar.
                    </td>
                  </tr>
                ) : (
                  daftarPetugas.map((user) => (
                    <tr key={user._id} className="transition hover:bg-emerald-950/20">
                      <td className="px-6 py-4 font-medium text-white">{user.fullName}</td>
                      <td className="px-6 py-4 text-slate-400">@{user.username}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          <button className="rounded-xl border border-emerald-900/60 bg-[#10241a] p-2 text-emerald-400 transition hover:bg-emerald-900/60" title="Edit Petugas">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="rounded-xl border border-red-900/60 bg-red-950/20 p-2 text-red-400 transition hover:bg-red-950/40" title="Hapus Petugas">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
}