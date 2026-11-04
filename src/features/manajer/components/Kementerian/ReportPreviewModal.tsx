
"use client";

import React, { useEffect } from "react";
import { FileText, Send, X } from "lucide-react";
import { formatDate } from "@/lib/date";
import { Table, ColumnDef } from "@/components/ui/Table";
import { ReportPayload, MinistryReportData, BAPFieldReport, MonthlySummaryReport } from "@/types/ministry";

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPayload: ReportPayload;
  onSend: () => void;
  isSubmitting: boolean;
  submitStatus: "draft" | "sent";
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  isOpen,
  onClose,
  currentPayload,
  onSend,
  isSubmitting,
  submitStatus,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const isBAP = (report: MinistryReportData): report is BAPFieldReport => {
    return currentPayload.tipeDokumen === "BAP";
  };
  
  const columns: ColumnDef<MinistryReportData>[] =
    currentPayload.tipeDokumen === "BAP"
      ? [
          { header: "No", key: "no", cell: (_, idx) => idx + 1 },
          { header: "Nama Satwa", key: "namaSatwa", cell: (item) => (isBAP(item) ? item.namaSatwa : "") },
          { header: "Kategori", key: "kategori", cell: (item) => (isBAP(item) ? item.kategori : "") },
          { header: "Jumlah", key: "jumlah", cell: (item) => (isBAP(item) ? item.jumlah : "") },
          { header: "Lokasi", key: "lokasi", cell: (item) => (isBAP(item) ? item.lokasi : "") },
          { header: "Shift", key: "shift", cell: (item) => (isBAP(item) ? item.shift : "") },
          { header: "Tanggal", key: "tanggal", cell: (item) => (isBAP(item) ? formatDate(item.tanggalPengamatan) : "") },
        ]
      : [
          { header: "No", key: "no", cell: (_, idx) => idx + 1 },
          { header: "Nama Satwa", key: "namaSatwa", cell: (item) => (!isBAP(item) ? item.namaSatwa : "") },
          { header: "Total Jumlah", key: "totalJumlah", cell: (item) => (!isBAP(item) ? item.totalJumlah : "") },
          { header: "Lokasi", key: "lokasi", cell: (item) => (!isBAP(item) ? item.lokasiList.join(", ") : "") },
        ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-panel-bg border border-brand-primary rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        <div className="p-4 border-b border-brand-primary/80 flex justify-between items-center bg-surface-dark">
          <div className="flex items-center gap-2 text-brand-text">
            <FileText size={18} />
            <h3 className="font-semibold text-sm text-text-heading">Draf Preview Naskah Dinas Kementerian</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-text-heading p-1 rounded-lg hover:bg-brand-primary/50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono text-text-secondary bg-surface-bg">
          <div className="border-b border-dashed border-brand-primary/60 pb-3 text-center space-y-1">
            <p className="font-bold text-text-heading text-sm">KEMENTERIAN LINGKUNGAN HIDUP DAN KEHUTANAN</p>
            <p className="text-text-muted">BALAI TAMAN NASIONAL ALAS PURWO</p>
            <p className="text-xs text-brand-hover">Nomor: {currentPayload.nomorSurat}</p>
          </div>

          <div className="space-y-1 text-text-secondary font-sans">
            <p><strong>Perihal:</strong> {currentPayload.tipeDokumen === "BULANAN" ? "Laporan Rekapitulasi Populasi Bulanan" : "Berita Acara Perjumpaan"}</p>
            <p><strong>Tanggal:</strong> {currentPayload.tanggalDibuat}</p>
            <p><strong>Total Satwa Terdaftar:</strong> {currentPayload.totalIndividu} Ekor ({currentPayload.totalKasus} Kasus)</p>
          </div>

          <div className="pt-2">
            <p className="text-slate-400 mb-2 font-sans font-semibold text-[11px]">Daftar Data Terlampir:</p>
            <div className="overflow-x-auto rounded-xl border border-emerald-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#030705] text-emerald-400 border-b border-emerald-950">
                  <tr>
                    <th className="px-3 py-2 font-medium">No</th>
                    <th className="px-3 py-2 font-medium">Nama Satwa</th>
                    <th className="px-3 py-2 font-medium">Kategori</th>
                    <th className="px-3 py-2 font-medium">Jumlah</th>
                    <th className="px-3 py-2 font-medium">Lokasi</th>
                    <th className="px-3 py-2 font-medium">Shift</th>
                    <th className="px-3 py-2 font-medium">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-950/50 bg-[#060d0a] text-slate-300">
                  {!Array.isArray(currentPayload.data) || currentPayload.data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-3 py-4 text-center text-slate-500 italic">
                        Tidak ada data pengamatan terlampir.
                      </td>
                    </tr>
                  ) : (
                    currentPayload.data.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-emerald-950/20">
                        <td className="px-3 py-2">{idx + 1}</td>
                        <td className="px-3 py-2 font-medium text-emerald-300">{item.namaSatwa || item.namaSpesies || "-"}</td>
                        <td className="px-3 py-2">{item.kategori || "-"}</td>
                        <td className="px-3 py-2">{item.jumlah || item.totalJumlah || "-"}</td>
                        <td className="px-3 py-2">{item.lokasi || (item.lokasiList ? item.lokasiList.join(", ") : "-")}</td>
                        <td className="px-3 py-2">{item.shift || "-"}</td>
                        <td className="px-3 py-2">{item.tanggalPengamatan ? new Date(item.tanggalPengamatan).toLocaleDateString("id-ID") : "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-brand-primary/80 bg-surface-dark flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-text-muted hover:text-text-heading rounded-xl border border-border-input hover:bg-card-bg transition-all"
          >
            Tutup
          </button>
          <button
            onClick={onSend}
            disabled={isSubmitting || submitStatus === "sent"}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-text-heading bg-brand-primary disabled:bg-brand-primary/40 rounded-xl hover:bg-brand-hover transition-all"
          >
            <Send size={14} /> Send Now
          </button>
        </div>

      </div>
    </div>
  );
};
