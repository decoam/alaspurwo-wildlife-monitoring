import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  BarChart3, 
  History, 
  FileSpreadsheet, 
  Users, 
  Building2, 
  LogOut 
} from "lucide-react";

interface ManagerSidebarProps {
  currentPath: string; // Untuk menentukan menu mana yang sedang aktif/highlighted
}

export const ManagerSidebar: React.FC<ManagerSidebarProps> = ({ currentPath }) => {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex h-full w-72 flex-col justify-between border-r border-emerald-900/40 bg-[#040a07] p-6 text-slate-200">
      
      {/* Bagian Atas: Identitas Aplikasi & Role */}
      <div>
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold tracking-wider text-emerald-400">
            WILDLIFE MNGMT
          </h1>
          <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
            Alas Purwo National Park
          </p>
        </div>

        {/* Menu Navigasi Berdasarkan Tanggung Jawab */}
        <nav className="space-y-1.5">
          
          {/* 1. Dashboard Utama */}
          <Link
            href="/dashboard/manajer"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              currentPath === "/dashboard/manajer"
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:bg-emerald-950/30 hover:text-emerald-400"
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard Utama</span>
          </Link>

          {/* 2. Monitoring & Tren Satwa */}
          <Link
            href="/dashboard/manajer/tren"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              currentPath === "/dashboard/manajer/tren"
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:bg-emerald-950/30 hover:text-emerald-400"
            }`}
          >
            <BarChart3 size={18} />
            <span>Monitoring & Tren</span>
          </Link>

          {/* 3. Pencarian Historis */}
          <Link
            href="/dashboard/manajer/histori"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              currentPath === "/dashboard/manajer/histori"
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:bg-emerald-950/30 hover:text-emerald-400"
            }`}
          >
            <History size={18} />
            <span>Pencarian Historis</span>
          </Link>

          {/* 4. Kelola Laporan (Export) */}
          <Link
            href="/dashboard/manajer/laporan"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              currentPath === "/dashboard/manajer/laporan"
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:bg-emerald-950/30 hover:text-emerald-400"
            }`}
          >
            <FileSpreadsheet size={18} />
            <span>Kelola Laporan</span>
          </Link>

          {/* 5. Kontrol Akses Petugas */}
          <Link
            href="/dashboard/manajer/petugas"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              currentPath.startsWith("/dashboard/manajer/petugas")
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:bg-emerald-950/30 hover:text-emerald-400"
            }`}
          >
            <Users size={18} />
            <span>Kontrol Akses Petugas</span>
          </Link>

          {/* 6. Laporan Kementerian */}
          <Link
            href="/dashboard/manajer/kementerian"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              currentPath === "/dashboard/manajer/kementerian"
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:bg-emerald-950/30 hover:text-emerald-400"
            }`}
          >
            <Building2 size={18} />
            <span>Laporan Kementerian</span>
          </Link>

        </nav>
      </div>

      {/* Bagian Bawah: Aksi Sistem */}
      <div className="border-t border-emerald-900/40 pt-4">
        <button
          onClick={() => console.log("Proses logout dijalankan")}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-all"
        >
          <LogOut size={18} />
          <span>Keluar Sistem</span>
        </button>
      </div>

    </aside>
  );
};