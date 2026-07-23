"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FileText, ShieldAlert, CheckCircle2, Clock, Send, Info, Eye, Loader2 } from "lucide-react";
import { FieldReport } from "@/features/manajer/ReportUtils";
import { ReportPreviewModal } from "./ReportPreviewModal";
import { ReportTables } from "./ReportTables";

interface MinistryReportCenterProps {
  initialReports: FieldReport[];
}

export const MinistryReportCenter: React.FC<MinistryReportCenterProps> = ({ initialReports }) => {
  const [reports] = useState<FieldReport[]>(initialReports);
  const [documentType, setDocumentType] = useState<"BULANAN" | "BAP">("BULANAN");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"draft" | "sent">("draft");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // State Dinamis dari Database Master Satwa Universal
  const [protectedKeywords, setProtectedKeywords] = useState<string[]>([]);
  const [isLoadingSpecies, setIsLoadingSpecies] = useState(true);

  // 1. Fetch Data Master Satwa Dilindungi dari Endpoint Universal (/api/satwa?protected=true)
  useEffect(() => {
    const fetchProtectedSpecies = async () => {
      try {
        const res = await fetch("/api/satwa?protected=true");

        // Memastikan HTTP response OK (bukan 404/500 HTML Page)
        if (!res.ok) {
          throw new Error(`Gagal mengambil data satwa. Status: ${res.status}`);
        }

        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          // Mengambil semua array kata kunci dari koleksi satwa universal
          const keywords = result.data.flatMap(
            (spesies: { keywords: string[]; namaSpesies: string }) =>
              spesies.keywords || [spesies.namaSpesies.toLowerCase()]
          );
          setProtectedKeywords(keywords);
        }
      } catch (error) {
        console.error("Gagal memuat master satwa dilindungi dari database:", error);
      } finally {
        setIsLoadingSpecies(false);
      }
    };

    fetchProtectedSpecies();
  }, []);

  // 2. Filter Laporan Satwa Dilindungi berdasarkan Kata Kunci Dinamis
  const protectedAnimalReports = useMemo(() => {
    if (protectedKeywords.length === 0) return [];

    return reports.filter((rep) =>
      protectedKeywords.some((keyword) =>
        rep.namaSatwa.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }, [reports, protectedKeywords]);

  // Total individu
  const totalProtectedEkor = useMemo(() => {
    return protectedAnimalReports.reduce((sum, item) => sum + item.jumlah, 0);
  }, [protectedAnimalReports]);

  // 3. Akumulasi data bulanan per spesies & lokasi pos
  const monthlySummary = useMemo(() => {
    const summaryMap: { [key: string]: { namaSatwa: string; totalJumlah: number; lokasiList: string[] } } = {};

    protectedAnimalReports.forEach((item) => {
      const key = item.namaSatwa.toLowerCase();
      const pos = item.posPengamatan || item.lokasi || "Sadengan";

      if (!summaryMap[key]) {
        summaryMap[key] = {
          namaSatwa: item.namaSatwa,
          totalJumlah: 0,
          lokasiList: [],
        };
      }
      summaryMap[key].totalJumlah += item.jumlah;
      if (!summaryMap[key].lokasiList.includes(pos)) {
        summaryMap[key].lokasiList.push(pos);
      }
    });

    return Object.values(summaryMap);
  }, [protectedAnimalReports]);

  // Data Payload Dokumen
  const currentPayload = useMemo(() => ({
    nomorSurat: `KLHK/TN-AP/${documentType}/${new Date().getFullYear()}/001`,
    tipeDokumen: documentType === "BULANAN" ? "Laporan Rekapitulasi Populasi Bulanan" : "Berita Acara Perjumpaan",
    satker: "Balai Taman Nasional Alas Purwo",
    totalKasus: protectedAnimalReports.length,
    totalIndividu: totalProtectedEkor,
    data: documentType === "BULANAN" ? monthlySummary : protectedAnimalReports,
    tanggalDibuat: new Date().toLocaleDateString("id-ID", { dateStyle: "full" }),
  }), [documentType, protectedAnimalReports, totalProtectedEkor, monthlySummary]);

  const handleSendToMinistry = () => {
    setIsSubmitting(true);
    console.log("Mengirim payload ke KLHK:", currentPayload);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("sent");
      setIsPreviewOpen(false);
      alert(`Berhasil mengirimkan ${currentPayload.tipeDokumen} ke Server Pusat Kementerian LHK!`);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 bg-[#060d0a] text-slate-200 space-y-6 relative">
      
      {/* Ringkasan Analitik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#091710] border border-emerald-900/40 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/20 text-amber-400">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Spesies Prioritas KLHK</p>
            {isLoadingSpecies ? (
              <div className="flex items-center gap-2 mt-1 text-slate-400 text-xs">
                <Loader2 size={14} className="animate-spin" /> Memuat data DB...
              </div>
            ) : (
              <h3 className="text-xl font-bold text-white mt-0.5">{protectedAnimalReports.length} Kasus</h3>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#091710] border border-emerald-900/40 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Individu Terpantau</p>
            {isLoadingSpecies ? (
              <div className="flex items-center gap-2 mt-1 text-slate-400 text-xs">
                <Loader2 size={14} className="animate-spin" /> Memuat data DB...
              </div>
            ) : (
              <h3 className="text-xl font-bold text-white mt-0.5">{totalProtectedEkor} Ekor</h3>
            )}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#091710] border border-emerald-900/40 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-950/50 border border-blue-500/20 text-blue-400">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Status Sinkronisasi Berkas</p>
            <span className={`inline-block text-xs font-semibold mt-1 px-2.5 py-0.5 rounded-full ${
              submitStatus === "sent" ? "bg-blue-950 text-blue-400 border border-blue-800" : "bg-amber-950 text-amber-400 border border-amber-800"
            }`}>
              {submitStatus === "sent" ? "Terverifikasi Pusat" : "Menunggu Pengiriman"}
            </span>
          </div>
        </div>
      </div>

      {/* Kontrol Generator Dokumen Naskah Dinas */}
      <div className="p-5 rounded-2xl border border-emerald-900/40 bg-[#07130d] space-y-4">
        <div className="flex items-center gap-2">
          <Info size={16} className="text-emerald-500" />
          <span className="text-xs font-semibold text-white">Pilih Format Standar Tata Naskah Dinas Kementerian LHK:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1 bg-[#040906] rounded-xl border border-emerald-950">
          <button
            type="button"
            onClick={() => setDocumentType("BULANAN")}
            className={`py-2.5 px-4 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${
              documentType === "BULANAN" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText size={14} /> Laporan Perkembangan Populasi Bulanan
          </button>
          <button
            type="button"
            onClick={() => setDocumentType("BAP")}
            className={`py-2.5 px-4 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${
              documentType === "BAP" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText size={14} /> Berita Acara Perjumpaan Satwa Dilindungi
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-emerald-950 gap-4">
          <div className="text-xs text-slate-400">
            Format Aktif: <strong className="text-emerald-400">
              {documentType === "BULANAN" ? "Rekapitulasi Tren Populasi Satwa" : "Rincian Berita Acara Insidental"}
            </strong>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 rounded-xl hover:bg-emerald-900/60 transition-all w-full sm:w-auto"
            >
              <Eye size={14} /> Preview Dokumen
            </button>

            <button
              onClick={handleSendToMinistry}
              disabled={isSubmitting || submitStatus === "sent" || isLoadingSpecies}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 disabled:bg-emerald-900/40 disabled:text-slate-400 rounded-xl hover:bg-emerald-500 transition-all w-full sm:w-auto shadow-lg"
            >
              <Send size={14} /> {isSubmitting ? "Mengirim..." : submitStatus === "sent" ? "Sudah Terkirim" : "Kirim Dokumen Resmi"}
            </button>
          </div>
        </div>
      </div>

      {/* TABEL ADAPTIF */}
      <ReportTables
        documentType={documentType}
        monthlySummary={monthlySummary}
        protectedAnimalReports={protectedAnimalReports}
      />

      {/* MODAL PREVIEW DOKUMEN */}
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