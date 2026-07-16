"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  History, 
  FileSpreadsheet, 
  Users, 
  Building2, 
  LogOut, 
  Camera
} from "lucide-react";
import { signOut } from "next-auth/react";

interface ManagerSidebarProps {
  currentPath: string;
  user: {
    fullName: string;
    role: string;
    avatarInitials: string;
  };
}

export const ManagerSidebar: React.FC<ManagerSidebarProps> = ({ currentPath, user }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  // Menu items disesuaikan dengan 6 tanggung jawab Manajer
  const menuItems = [
    { label: "Dashboard", href: "/dashboard/manajer", icon: LayoutDashboard},
    { label: "Detail Observasi", href: "/dashboard/manajer/histori", icon: Camera },
    { label: "Kelola Laporan", href: "/dashboard/manajer/laporan", icon: FileSpreadsheet },
    { label: "Kontrol Akses Petugas", href: "/dashboard/manajer/petugas", icon: Users },
    { label: "Laporan Kementerian", href: "/dashboard/manajer/kementerian", icon: Building2 },
  ];

  return (
    // Menggunakan posisi fixed agar mengunci di kiri layar
    <aside className="fixed bottom-4 left-4 top-4 z-20 flex w-64 flex-col justify-between rounded-[28px] border border-emerald-900/60 bg-[#07110c]/90 p-5 shadow-2xl">
      <div>
        {/* Bagian Profil User */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-lime-600 text-lg font-semibold text-white">
            {user.avatarInitials || "MG"}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{user.fullName || "Manajer TNAP"}</p>
            <p className="text-xs text-emerald-200/70">{user.role || "Manajer"}</p>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Cek keaktifan menu berdasarkan currentPath dari server component
            const isActive = item.href === "/dashboard/manajer" 
              ? currentPath === "/dashboard/manajer"
              : currentPath.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-700/30 text-white shadow-inner"
                    : "text-slate-300 hover:bg-emerald-900/50 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Tombol Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-2xl border border-amber-900/40 bg-amber-950/30 px-3 py-3 text-sm font-medium text-amber-100 transition hover:bg-amber-900/40 w-full"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
};