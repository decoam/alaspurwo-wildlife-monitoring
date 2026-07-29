import React from "react";
import { ShieldCheck, UserCheck } from "lucide-react";

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
    <div className="rounded-3xl border border-brand-primary/40 bg-surface-bg/50 p-6 shadow-md flex flex-col justify-between h-full">
      <div>
        {/* Bagian Atas: Judul & Tombol Expand ke Halaman Baru */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-body flex items-center gap-2">
            <ShieldCheck size={20} className="text-brand-text" />
            Kontrol Akses Petugas
          </h2>
        </div>

        <p className="text-xs text-text-muted mb-4">
          Ringkasan manajemen hak akses akun petugas lapangan Taman Nasional Alas Purwo.
        </p>

        {/* Indikator Data Riil dari MongoDB */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/20 p-3 rounded-xl border border-brand-primary/20">
            <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium">Total Petugas</p>
            <p className="text-lg font-bold text-brand-text">{totalPetugas} Aktif</p>
          </div>
          <div className="bg-black/20 p-3 rounded-xl border border-brand-primary/20">
            <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium">Pos Pantau</p>
            <p className="text-lg font-bold text-brand-text">{totalPos} Wilayah</p>
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Log Aktivitas Singkat dari DB */}
      <div className="text-[11px] text-text-muted bg-surface-dark p-3 rounded-xl border border-brand-primary/30 flex items-center gap-2">
        <UserCheck size={14} className="text-text-muted shrink-0" />
        <span className="truncate">
          {lastActivePetugas ? (
            <>Aktivitas terakhir oleh: <strong className="text-text-body">{lastActivePetugas}</strong></>
          ) : (
            "Belum ada aktivitas petugas hari ini."
          )}
        </span>
      </div>
    </div>
  );
};