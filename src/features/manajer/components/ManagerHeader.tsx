"use client";

import React from "react";
import { BellRing, Search } from "lucide-react";

type ManagerHeaderProps = {
  searchValue?: string;
  user: {
    fullName: string;
    role: string;
    avatarInitials: string;
  };
};

export function ManagerHeader({ searchValue = "", user }: ManagerHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-[28px] border border-emerald-900/60 bg-[#0c1914]/85 px-5 py-4 shadow-[0_20px_60px_rgba(2,8,23,0.2)] md:flex-row md:items-center md:justify-between">
      {/* Kiri: Judul Halaman Utama */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400">
          Monitoring Center
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-white">Dashboard Konservasi</h1>
      </div>

      {/* Kanan: Pencarian, Notifikasi, dan Profil */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Form Pencarian Arahkan ke Fitur Histori Manajer */}
        <form 
          method="GET" 
          action="/dashboard/manajer/histori" 
          className="flex items-center gap-2 rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2 text-sm text-slate-400"
        >
          <Search className="h-4 w-4" />
          <input
            name="search"
            defaultValue={searchValue}
            className="w-full bg-transparent outline-none placeholder:text-slate-500 sm:w-56"
            placeholder="Cari satwa, lokasi, petugas..."
          />
        </form>

        <div className="flex items-center gap-3">
          {/* Tombol Notifikasi */}
          <button className="rounded-2xl border border-emerald-900/60 bg-[#10241a] p-2.5 text-emerald-200 transition hover:bg-emerald-900/60">
            <BellRing className="h-4 w-4" />
          </button>

          {/* Widget Info Login User */}
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-900/60 bg-[#10241a] px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-lime-600 font-semibold text-white">
              {user.avatarInitials}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user.fullName}</p>
              <p className="text-xs text-slate-400">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}