import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowUpRight, UserCheck } from "lucide-react";

interface AccessControlCardProps {
  totalPetugas: number;
  totalPos: number;
  lastActivePetugas: string;
}

export const AccessControlCard: React.FC<AccessControlCardProps> = ({
  totalPetugas,
  totalPos,
  lastActivePetugas,
}) => {
  return (
    <div className="rounded-3xl border border-emerald-900/40 bg-[#07110c]/50 p-6 shadow-md flex flex-col justify-between h-full">
      <div>
        {/* Bagian Atas: Judul & Tombol Expand ke Halaman Baru */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-400" />
            Kontrol Akses Petugas
          </h2>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Ringkasan manajemen hak akses akun petugas lapangan Taman Nasional Alas Purwo.
        </p>

        {/* Indikator Data Riil dari MongoDB */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/20 p-3 rounded-xl border border-emerald-900/20">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Total Petugas</p>
            <p className="text-lg font-bold text-emerald-400">{totalPetugas} Aktif</p>
          </div>
          <div className="bg-black/20 p-3 rounded-xl border border-emerald-900/20">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Pos Pantau</p>
            <p className="text-lg font-bold text-emerald-400">{totalPos} Wilayah</p>
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Log Aktivitas Singkat dari DB */}
      <div className="text-[11px] text-slate-400 bg-[#040a07] p-3 rounded-xl border border-emerald-900/30 flex items-center gap-2">
        <UserCheck size={14} className="text-slate-500 shrink-0" />
        <span className="truncate">
          {lastActivePetugas ? (
            <>Aktivitas terakhir oleh: <strong className="text-slate-200">{lastActivePetugas}</strong></>
          ) : (
            "Belum ada aktivitas petugas hari ini."
          )}
        </span>
      </div>
    </div>
  );
};