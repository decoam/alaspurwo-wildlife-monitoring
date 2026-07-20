"use client";

import React, { useState, useMemo } from "react";
import { FileText, ShieldAlert, CheckCircle2, Clock, Send, Info } from "lucide-react";
import { FieldReport } from "./ManageReports";

interface MinistryReportCenterProps {
  initialReports: FieldReport[];
}

// Daftar satwa yang masuk prioritas pemantauan kementerian di Alas Purwo
const SATWA_DILINDUNGI = ["banteng", "macan tutul", "elang", "merak", "penyu"];

export const MinistryReportCenter: React.FC<MinistryReportCenterProps> = ({ initialReports }) => {
  const [reports] = useState<FieldReport[]>(initialReports);
  const [documentType, setDocumentType] = useState<"BAP" | "BULANAN">("BULANAN");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"draft" | "sent">("draft");

  // 1. FILTER TANGGUNG JAWAB: Hanya menyaring spesies prioritas regulasi kementerian
  const protectedAnimalReports = useMemo(() => {
    return reports.filter((rep) =>
      SATWA_DILINDUNGI.some((satwa) => rep.namaSatwa.toLowerCase().includes(satwa))
    );
  }, [reports]);

  // Hitung total ekor satwa dilindungi yang terdeteksi
  const totalProtectedEkor = useMemo(() => {
    return protectedAnimalReports.reduce((sum, item) => sum + item.jumlah, 0);
  }, [protectedAnimalReports]);

  const handleSendToMinistry = () => {
    setIsSubmitting(true);
    // Simulasi integrasi pengiriman berkas ke server KLHK
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("sent");
      alert("Dokumen berhasil disinkronisasi ke Sistem Informasi Kehati Kementerian LHK.");
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 bg-[#060d0a] text-slate-200 space-y-6">
      
      {/* Ringkasan Analitik Kepatuhan Hukum */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#091710] border border-emerald-900/40 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/20 text-amber-400">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Spesies Prioritas KLHK</p>
            <h3 className="text-xl font-bold text-white mt-0.5">{protectedAnimalReports.length} Kasus</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#091710] border border-emerald-900/40 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Individu Terpantau</p>
            <h3 className="text-xl font-bold text-white mt-0.5">{totalProtectedEkor} Ekor</h3>
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
              documentType === "BULANAN" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText size={14} /> Laporan Perkembangan Populasi Bulanan
          </button>
          <button
            type="button"
            onClick={() => setDocumentType("BAP")}
            className={`py-2.5 px-4 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${
              documentType === "BAP" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText size={14} /> Berita Acara Perjumpaan Satwa Dilindungi
          </button>
        </div>

        {/* Info Aksi */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-emerald-950 gap-4">
          <div className="text-xs text-slate-400">
            Menyusun <strong className="text-emerald-400">{protectedAnimalReports.length} data observasi</strong> terfilter ke dalam draf kementerian.
          </div>
          <button
            onClick={handleSendToMinistry}
            disabled={isSubmitting || submitStatus === "sent"}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 disabled:bg-emerald-900/40 disabled:text-slate-400 rounded-xl hover:bg-emerald-500 transition-all w-full sm:w-auto shadow-lg"
          >
            <Send size={14} /> {isSubmitting ? "Mengirim Berkas..." : submitStatus === "sent" ? "Sudah Terkirim" : "Kirim Dokumen Resmi"}
          </button>
        </div>
      </div>

      {/* Pratonton Tabel Data Konservasi */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase px-1">
          Daftar Baris Data Kepatuhan Kehati (Terfilter Otomatis)
        </h4>
        <div className="overflow-x-auto rounded-xl border border-emerald-950 bg-[#040906]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-emerald-950 bg-[#07130d] text-slate-300">
                <th className="p-3 font-semibold">Spesies Prioritas</th>
                <th className="p-3 font-semibold">Total</th>
                <th className="p-3 font-semibold">Titik Koordinat/Pos</th>
                <th className="p-3 font-semibold">Waktu Amatan</th>
                <th className="p-3 font-semibold">Status Hukum</th>
              </tr>
            </thead>
            <tbody>
              {protectedAnimalReports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-600 italic">
                    Tidak ditemukan perjumpaan satwa dilindungi dalam data laporan kali ini.
                  </td>
                </tr>
              ) : (
                protectedAnimalReports.map((rep) => (
                  <tr key={rep._id} className="border-b border-emerald-950/40 hover:bg-emerald-950/10 text-slate-300">
                    <td className="p-3 font-medium text-white italic">{rep.namaSatwa}</td>
                    <td className="p-3 text-emerald-400 font-bold">{rep.jumlah} Ekor</td>
                    <td className="p-3">{rep.posPengamatan || rep.lokasi}</td>
                    <td className="p-3">{new Date(rep.tanggalPengamatan).toLocaleDateString("id-ID")}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-950/60 border border-red-900/40 text-red-400">
                        Dilindungi (Prioritas)
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};