import React from "react";
import { Search, Bell, UserCheck } from "lucide-react";

interface ManagerHeaderProps {
  user: {
    name: string;
    email: string;
  };
}

export const ManagerHeader: React.FC<ManagerHeaderProps> = ({ user }) => {
  // Membuat inisial nama secara dinamis dari database
  const avatarInitials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "MG";

  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-emerald-900/40 bg-[#07110c]/50 p-4 shadow-md sm:flex-row sm:items-center sm:justify-between lg:p-5">
      
      {/* Kiri: Kolom Pencarian Global */}
      <div className="relative flex-1 max-w-md w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <Search size={18} />
        </div>
        <form action="/dashboard/manajer/histori" method="GET" className="w-full">
          <input
            type="text"
            name="search"
            placeholder="Cari data historis (spesies, pos, petugas)..."
            className="w-full rounded-xl border border-emerald-900/60 bg-[#07110c]/80 py-2.5 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-400 outline-none ring-emerald-500/30 transition-all focus:border-emerald-500 focus:ring-4"
          />
        </form>
      </div>

      {/* Kanan: Informasi Akun Manajer dari MongoDB */}
      <div className="flex items-center justify-end gap-4">
        
        <button 
          className="relative rounded-xl border border-emerald-900/60 bg-[#07110c]/60 p-2.5 text-slate-300 hover:bg-emerald-950/40 hover:text-emerald-400 transition-all"
          title="Notifikasi Laporan Masuk"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        </button>

        <div className="hidden h-8 w-1px bg-emerald-900/40 sm:block" />

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-200">{user.name || "Manager"}</p>
            <p className="flex items-center justify-end gap-1 text-xs text-emerald-400 font-medium">
              <UserCheck size={12} />
              Manajer Balai TNAP
            </p>
          </div>

          {/* Avatar Inisial Dinamis */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 font-bold text-black shadow-md">
            {avatarInitials}
          </div>
        </div>

      </div>
    </header>
  );
};