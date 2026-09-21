"use client";

import React from "react";
import { FileText, ShieldAlert, CheckCircle2, Clock, Send, Info, Eye, Loader2 } from "lucide-react";
import { FieldReport } from "@/features/manajer/ReportUtils";
import { ReportPreviewModal } from "./ReportPreviewModal";
import { ReportTables } from "./ReportTables";
import { useMinistryReportLogic } from "@/features/manajer/MinistryReportLogic";

interface MinistryReportCenterProps {
  initialReports: FieldReport[];
}

export const MinistryReportCenter: React.FC<MinistryReportCenterProps> = ({ initialReports }) => {
  const {
    documentType,
    setDocumentType,
    isSubmitting,
    submitStatus,
    newCount,
    isPreviewOpen,
    setIsPreviewOpen,
    isLoadingSpecies,
    protectedAnimalReports,
    totalProtectedEkor,
    monthlySummary,
    currentPayload,
    handleSendToMinistry,
  } = useMinistryReportLogic(initialReports);

  return (
    <div className="p-4 md:p-6 bg-surface-bg text-text-body space-y-6 relative">
      
      {/* 1. Ringkasan Analitik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-card-bg border border-brand-primary/40 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-bg border-amber-bg text-amber-text">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs text-text-muted">Spesies Prioritas KLHK</p>
            {isLoadingSpecies ? (
              <div className="flex items-center gap-2 mt-1 text-text-muted text-xs">
                <Loader2 size={14} className="animate-spin" /> Memuat data DB...
              </div>
            ) : (
              <h3 className="text-xl font-bold text-text-heading mt-0.5">{protectedAnimalReports.length} Kasus</h3>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card-bg border border-brand-primary/40 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-primary/50 border border-brand-hover/20 text-brand-text">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs text-text-muted">Total Individu Terpantau</p>
            {isLoadingSpecies ? (
              <div className="flex items-center gap-2 mt-1 text-text-muted text-xs">
                <Loader2 size={14} className="animate-spin" /> Memuat data DB...
              </div>
            ) : (
              <h3 className="text-xl font-bold text-text-heading mt-0.5">{totalProtectedEkor} Ekor</h3>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card-bg border border-brand-primary/40 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-bg border-blue-bg text-blue-text">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-text-muted">Status Sinkronisasi Berkas</p>
            <span className={`inline-block text-xs font-semibold mt-1 px-2.5 py-0.5 rounded-full ${
              submitStatus === "sent" 
                ? "bg-blue-bg text-blue-text border border-brand-border/40" 
                : "bg-amber-bg text-amber-text border border-brand-border/40"
            }`}>
              {submitStatus === "sent" 
                ? "Terverifikasi Pusat" 
                : newCount > 0 
                  ? `Menunggu Pengiriman (${newCount} Data Baru)` 
                  : "Menunggu Pengiriman"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Kontrol Generator Dokumen Naskah Dinas */}
      <div className="p-5 rounded-2xl border border-brand-border/40 bg-panel-bg space-y-4">
        <div className="flex items-center gap-2">
          <Info size={16} className="text-brand-hover" />
          <span className="text-xs font-semibold text-text-heading">Pilih Format Standar Tata Naskah Dinas Kementerian LHK:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1 bg-surface-dark rounded-xl border border-brand-primary/80">
          <button
            type="button"
            onClick={() => setDocumentType("BULANAN")}
            className={`py-2.5 px-4 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${
              documentType === "BULANAN" ? "bg-brand-primary text-text-heading shadow-lg" : "text-text-muted hover:text-text-heading"
            }`}
          >
            <FileText size={14} /> Laporan Perkembangan Populasi Bulanan
          </button>
          <button
            type="button"
            onClick={() => setDocumentType("BAP")}
            className={`py-2.5 px-4 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${
              documentType === "BAP" ? "bg-brand-primary text-text-heading shadow-lg" : "text-text-muted hover:text-text-heading"
            }`}
          >
            <FileText size={14} /> Berita Acara Perjumpaan Satwa Dilindungi
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-brand-primary/80 gap-4">
          <div className="text-xs text-text-muted">
            Format Aktif: <strong className="text-brand-text">
              {documentType === "BULANAN" ? "Rekapitulasi Tren Populasi Satwa" : "Rincian Berita Acara Insidental"}
            </strong>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-brand-text bg-transparent border border-brand-primary/60 rounded-xl hover:bg-brand-primary/20 transition-all w-full sm:w-auto"
            >
              <Eye size={14} /> Preview Dokumen
            </button>

            <button
              onClick={handleSendToMinistry}
              disabled={isSubmitting || submitStatus === "sent" || isLoadingSpecies}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-text-heading bg-brand-primary disabled:bg-brand-primary/40 disabled:text-text-muted rounded-xl hover:bg-brand-hover transition-all w-full sm:w-auto shadow-lg"
            >
              <Send size={14} /> {isSubmitting ? "Mengirim..." : submitStatus === "sent" ? "Sudah Terkirim" : "Kirim Dokumen Resmi"}
            </button>
          </div>
        </div>
      </div>

      {/* 3. TABEL ADAPTIF */}
      <ReportTables
        documentType={documentType}
        monthlySummary={monthlySummary}
        protectedAnimalReports={protectedAnimalReports}
      />

      {/* 4. MODAL PREVIEW DOKUMEN */}
      <ReportPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        currentPayload={currentPayload}
        onSend={handleSendToMinistry}
        isSubmitting={isSubmitting}
        submitStatus={submitStatus}
      />

    </div>
  );
};