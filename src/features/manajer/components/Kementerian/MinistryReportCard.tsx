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
    <div className="rounded-3xl border border-brand-primary/40 bg-surface-bg/50 p-6 shadow-md flex flex-col justify-between h-full">
      <div>
        {/* Bagian Atas: Judul & Navigasi Halaman Kementerian */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-body flex items-center gap-2">
            <Building2 size={20} className="text-brand-text" />
            Laporan Kementerian
          </h2>
        </div>

        <p className="text-xs text-text-muted mb-4">
          Sinkronisasi data keanekaragaman hayati TNAP dan standardisasi berkas laporan resmi kementerian.
        </p>

        {/* Status Sinkronisasi Real-Time dari MongoDB */}
        <div className="p-3 rounded-xl bg-black/20 border border-brand-primary/20 flex items-center justify-between text-xs mb-4">
          <div className="flex items-center gap-2">
            <CloudSync size={18} className={isSynced ? "text-brand-text" : "text-amber-text"} />
            <span className="text-text-secondary">Status Data Pusat</span>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
            isSynced 
              ? "bg-brand-primary/10 text-brand-text border border-brand-border/20" 
              : "bg-amber-bg text-amber-text border border-amber-bg"
          }`}>
            {isSynced ? "Terintegrasi" : "Butuh Sync"}
          </span>
        </div>
      </div>

      {/* Bagian Bawah: Indikator Validasi Data Tertunda */}
      <div className="text-xs text-text-muted bg-surface-dark p-3 rounded-xl border border-brand-primary/30 flex items-center gap-2">
        <ShieldAlert size={14} className={pendingSyncCount > 0 ? "text-amber-text" : "text-text-muted"} />
        <span className="truncate">
          {pendingSyncCount > 0 ? (
            <>Ada <strong className="text-amber-text">{pendingSyncCount} data baru</strong> belum dilaporkan ke pusat.</>
          ) : (
            <>Sinkronisasi terakhir pada: <strong className="text-text-body">{lastSyncDate || "-"}</strong></>
          )}
        </span>
      </div>
    </div>
  );
};