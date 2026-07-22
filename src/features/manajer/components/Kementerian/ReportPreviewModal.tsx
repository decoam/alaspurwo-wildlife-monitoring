"use client";

import React, { useEffect, useMemo } from "react";
import { FileText, Send, X } from "lucide-react";

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPayload: {
    nomorSurat: string;
    tipeDokumen: string;
    tanggalDibuat: string;
    totalIndividu: number;
    totalKasus: number;
    data: unknown;
  };
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
  // Penanganan Tombol Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Fallback Stringify aman dari Circular Reference Error
  const formattedJsonData = useMemo(() => {
    try {
      return JSON.stringify(currentPayload.data, null, 2);
    } catch {
      return "// [Gagal mengonversi data ke format JSON]";
    }
  }, [currentPayload.data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#07130d] border border-emerald-900 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Modal */}
        <div className="p-4 border-b border-emerald-950 flex justify-between items-center bg-[#040906]">
          <div className="flex items-center gap-2 text-emerald-400">
            <FileText size={18} />
            <h3 className="font-semibold text-sm text-white">Draf Preview Naskah Dinas Kementerian</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-emerald-950/50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Isi Preview Surat */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono text-slate-300 bg-[#060d0a]">
          <div className="border-b border-dashed border-emerald-900/60 pb-3 text-center space-y-1">
            <p className="font-bold text-white text-sm">KEMENTERIAN LINGKUNGAN HIDUP DAN KEHUTANAN</p>
            <p className="text-slate-400">BALAI TAMAN NASIONAL ALAS PURWO</p>
            <p className="text-[10px] text-emerald-500">Nomor: {currentPayload.nomorSurat}</p>
          </div>

          <div className="space-y-1 text-slate-300 font-sans">
            <p><strong>Perihal:</strong> {currentPayload.tipeDokumen}</p>
            <p><strong>Tanggal:</strong> {currentPayload.tanggalDibuat}</p>
            <p><strong>Total Satwa Terdaftar:</strong> {currentPayload.totalIndividu} Ekor ({currentPayload.totalKasus} Kasus)</p>
          </div>

          <div className="pt-2">
            <p className="text-slate-400 mb-2 font-sans font-semibold text-[11px]">Daftar Data Terlampir:</p>
            <pre className="bg-[#030705] p-3 rounded-xl border border-emerald-950 text-[11px] overflow-x-auto text-emerald-300">
              {formattedJsonData}
            </pre>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-4 border-t border-emerald-950 bg-[#040906] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl border border-slate-800 hover:bg-slate-900 transition-all"
          >
            Tutup
          </button>
          <button
            onClick={onSend}
            disabled={isSubmitting || submitStatus === "sent"}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 disabled:bg-emerald-900/40 rounded-xl hover:bg-emerald-500 transition-all"
          >
            <Send size={14} /> Send Now
          </button>
        </div>

      </div>
    </div>
  );
};