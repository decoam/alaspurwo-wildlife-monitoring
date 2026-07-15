import React from "react";
import Link from "next/link";
import { FileSpreadsheet, Download, ArrowUpRight, FileText } from "lucide-react";

interface ExportReportCardProps {
  totalReportReady: number;
  lastGeneratedDate: string;
}

export const ExportReportCard: React.FC<ExportReportCardProps> = ({
  totalReportReady,
  lastGeneratedDate,
}) => {
  return (
    <div className="rounded-3xl border border-emerald-900/40 bg-[#07110c]/50 p-6 shadow-md flex flex-col justify-between h-full">
      <div>
        {/* Bagian Atas: Judul & Navigasi ke Halaman Penuh */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <FileSpreadsheet size={20} className="text-emerald-400" />
            Kelola Laporan (Export)
          </h2>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Kompilasi berkas data observasi satwa liar siap cetak dalam berbagai format dokumen.
        </p>

        {/* List Opsi Unduhan Cepat */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/20 border border-emerald-900/20 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <FileSpreadsheet size={16} className="text-emerald-500" />
              <span>Format Data Mentah (.CSV / .XLSX)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Ready</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/20 border border-emerald-900/20 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <FileText size={16} className="text-cyan-500" />
              <span>Format Ringkasan PDF (.PDF)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Ready</span>
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Informasi Sinkronisasi Terakhir */}
      <div className="text-[11px] text-slate-400 bg-[#040a07] p-3 rounded-xl border border-emerald-900/30 flex items-center justify-between">
        <span className="truncate">
          Kompilasi terakhir: <strong className="text-slate-200">{lastGeneratedDate || "-"}</strong>
        </span>
        <span className="text-slate-500 text-[10px]">({totalReportReady} Berkas)</span>
      </div>
    </div>
  );
};