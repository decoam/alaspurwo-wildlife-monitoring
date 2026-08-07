import React from "react";
import { FileSpreadsheet, FileText } from "lucide-react";

interface ExportReportCardProps {
  totalReportReady: number;
  lastGeneratedDate: string;
}

export const ExportReportCard: React.FC<ExportReportCardProps> = ({
  totalReportReady,
  lastGeneratedDate,
}) => {
  return (
    <div className="rounded-3xl border border-brand-primary/40 bg-surface-bg/50 p-6 shadow-md flex flex-col justify-between h-full">
      <div>
        {/* Bagian Atas: Judul & Navigasi ke Halaman Penuh */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-body flex items-center gap-2">
            <FileSpreadsheet size={20} className="text-brand-text" />
            Kelola Laporan (Export)
          </h2>
        </div>

        <p className="text-xs text-text-muted mb-4">
          Kompilasi berkas data observasi satwa liar siap cetak dalam berbagai format dokumen.
        </p>

        {/* List Opsi Unduhan Cepat */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/20 border border-brand-primary/20 text-xs">
            <div className="flex items-center gap-2 text-text-secondary">
              <FileSpreadsheet size={16} className="text-brand-hover" />
              <span>Format Data Mentah (.CSV / .XLSX)</span>
            </div>
            <span className="text-xs text-brand-text font-medium">Ready</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/20 border border-brand-primary/20 text-xs">
            <div className="flex items-center gap-2 text-text-secondary">
              <FileText size={16} className="text-brand-text" />
              <span>Format Ringkasan PDF (.PDF)</span>
            </div>
            <span className="text-xs text-brand-text font-medium">Ready</span>
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Informasi Sinkronisasi Terakhir */}
      <div className="text-xs text-text-muted bg-surface-dark p-3 rounded-xl border border-brand-primary/30 flex items-center justify-between">
        <span className="truncate">
          Kompilasi terakhir: <strong className="text-text-body">{lastGeneratedDate || "-"}</strong>
        </span>
        <span className="text-text-muted text-xs">({totalReportReady} Berkas)</span>
      </div>
    </div>
  );
};