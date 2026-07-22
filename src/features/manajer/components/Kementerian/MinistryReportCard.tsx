import React from "react";
import { Building2, CloudSync, ShieldAlert } from "lucide-react";

interface MinistryReportCardProps {
  isSynced: boolean;
  lastSyncDate: string;
  pendingSyncCount: number;
}

export const MinistryReportCard: React.FC<MinistryReportCardProps> = ({
  isSynced,
  lastSyncDate,
  pendingSyncCount,
}) => {
  return (
    <div className="rounded-3xl border border-emerald-900/40 bg-[#07110c]/50 p-6 shadow-md flex flex-col justify-between h-full">
      <div>
        {/* Bagian Atas: Judul & Navigasi Halaman Kementerian */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <Building2 size={20} className="text-emerald-400" />
            Laporan Kementerian
          </h2>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Sinkronisasi data keanekaragaman hayati TNAP dan standardisasi berkas laporan resmi kementerian.
        </p>

        {/* Status Sinkronisasi Real-Time dari MongoDB */}
        <div className="p-3 rounded-xl bg-black/20 border border-emerald-900/20 flex items-center justify-between text-xs mb-4">
          <div className="flex items-center gap-2">
            <CloudSync size={18} className={isSynced ? "text-emerald-400" : "text-amber-400"} />
            <span className="text-slate-300">Status Data Pusat</span>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
            isSynced 
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}>
            {isSynced ? "Terintegrasi" : "Butuh Sync"}
          </span>
        </div>
      </div>

      {/* Bagian Bawah: Indikator Validasi Data Tertunda */}
      <div className="text-[11px] text-slate-400 bg-[#040a07] p-3 rounded-xl border border-emerald-900/30 flex items-center gap-2">
        <ShieldAlert size={14} className={pendingSyncCount > 0 ? "text-amber-500" : "text-slate-500"} />
        <span className="truncate">
          {pendingSyncCount > 0 ? (
            <>Ada <strong className="text-amber-400">{pendingSyncCount} data baru</strong> belum dilaporkan ke pusat.</>
          ) : (
            <>Sinkronisasi terakhir pada: <strong className="text-slate-200">{lastSyncDate || "-"}</strong></>
          )}
        </span>
      </div>
    </div>
  );
};