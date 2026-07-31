"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Users, 
  Building2, 
  LogOut, 
  Camera,
  Menu,
  X
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
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const menuItems = [
    { label: "Dashboard", href: "/dashboard/manajer", icon: LayoutDashboard},
    { label: "Detail Observasi", href: "/dashboard/manajer/histori", icon: Camera },
    { label: "Kelola Laporan", href: "/dashboard/manajer/laporan", icon: FileSpreadsheet },
    { label: "Kontrol Akses Petugas", href: "/dashboard/manajer/petugas", icon: Users },
    { label: "Laporan Kementerian", href: "/dashboard/manajer/kementerian", icon: Building2, iconClass: "opacity-60" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Tombol Hamburger aktif ketika versi layar dibawah ukuran XL */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-brand-hover/30 bg-surface-bg/90 text-brand-text shadow-glow backdrop-blur-md transition-all hover:scale-105 active:scale-95 xl:hidden"
        title="Menu Navigasi"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay hitam saat versi mobile aktif */}
      {isOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm xl:hidden"
        />
      )}

      {/* Sidebar Responsif */}
      <aside 
        className={`fixed bottom-4 top-4 z-45 flex w-64 flex-col justify-between rounded-[28px] border border-brand-primary/60 bg-surface-bg/95 p-5 shadow-2xl transition-all duration-300 ease-in-out
          /* Desktop Behavior */
          xl:left-4 xl:translate-x-0
          /* Mobile Behavior (Geser ke kiri layar jika ditutup, geser masuk jika dibuka) */
          ${isOpen ? "left-4 translate-x-0" : "-left-80 -translate-x-full xl:translate-x-0"}
        `}
      >
        <div>
          {/* Bagian Profil User */}
          <div className="mb-8 flex items-center gap-3 border-b border-brand-primary/20 pb-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-brand-hover to-accent-primary text-lg font-semibold text-text-heading">
              {user.avatarInitials || "MG"}
            </div>

            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-sm font-semibold text-text-heading wrap-break-words">
                {user.fullName || "Manajer TNAP"}
              </p>
              <p className="text-xs text-brand-text-light/70 mt-0.5 wrap-break-words">
                {user.role || "Manajer"}
              </p>
            </div>
          </div>

          {/* Menu Navigasi */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === "/dashboard/manajer" 
                ? currentPath === "/dashboard/manajer"
                : currentPath.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand-primary/30 text-text-heading shadow-inner"
                      : "text-text-secondary hover:bg-brand-primary/50 hover:text-text-heading"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${item.iconClass || ""}`} />
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
          className="flex items-center gap-3 rounded-2xl border border-amber-bg bg-amber-bg px-3 py-3 text-sm font-medium text-amber-text transition hover:bg-amber-bg/80 w-full"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>
    </>
  );
};