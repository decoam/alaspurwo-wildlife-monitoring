"use client";

import React, { useState, useMemo } from "react";
import { FileText, ShieldAlert, CheckCircle2, Clock, Send, Info, Eye, X } from "lucide-react";
import { FieldReport } from "./ManageReports";

interface MinistryReportCenterProps {
  initialReports: FieldReport[];
}

const SATWA_DILINDUNGI = ["banteng", "macan tutul", "elang", "merak", "penyu"];

export const MinistryReportCenter: React.FC<MinistryReportCenterProps> = ({ initialReports }) => {
  const [reports] = useState<FieldReport[]>(initialReports);
  const [documentType, setDocumentType] = useState<"BULANAN" | "BAP">("BULANAN");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"draft" | "sent">("draft");
  
  // State untuk Modal Preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // 1. Filter Satwa Dilindungi
  const protectedAnimalReports = useMemo(() => {
    return reports.filter((rep) =>
      SATWA_DILINDUNGI.some((satwa) => rep.namaSatwa.toLowerCase().includes(satwa))
    );
  }, [reports]);

  // Total individu
  const totalProtectedEkor = useMemo(() => {
    return protectedAnimalReports.reduce((sum, item) => sum + item.jumlah, 0);
  }, [protectedAnimalReports]);

  // 2. LOGIKA TABEL DINAMIS: Akumulasi data bulanan per spesies & lokasi pos
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
            {/* TOMBOL PREVIEW */}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 rounded-xl hover:bg-emerald-900/60 transition-all w-full sm:w-auto"
            >
              <Eye size={14} /> Preview Dokumen
            </button>

            {/* TOMBOL KIRIM */}
            <button
              onClick={handleSendToMinistry}
              disabled={isSubmitting || submitStatus === "sent"}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 disabled:bg-emerald-900/40 disabled:text-slate-400 rounded-xl hover:bg-emerald-500 transition-all w-full sm:w-auto shadow-lg"
            >
              <Send size={14} /> {isSubmitting ? "Mengirim..." : submitStatus === "sent" ? "Sudah Terkirim" : "Kirim Dokumen Resmi"}
            </button>
          </div>
        </div>
      </div>

      {/* TABEL ADAPTIF */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase px-1">
          {documentType === "BULANAN" ? "Tabel Akumulasi Populasi Bulanan (Format KLHK 01)" : "Tabel Berita Acara Perjumpaan Lapangan (Format BAP KLHK 02)"}
        </h4>
        
        <div className="overflow-x-auto rounded-xl border border-emerald-950 bg-[#040906]">
          {documentType === "BULANAN" ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-emerald-950 bg-[#07130d] text-slate-300">
                  <th className="p-3 font-semibold">Spesies Prioritas</th>
                  <th className="p-3 font-semibold">Akumulasi Populasi</th>
                  <th className="p-3 font-semibold">Pos Pengamatan</th>
                  <th className="p-3 font-semibold">Status Perlindungan</th>
                </tr>
              </thead>
              <tbody>
                {monthlySummary.map((item, idx) => (
                  <tr key={idx} className="border-b border-emerald-950/40 hover:bg-emerald-950/10 text-slate-300">
                    <td className="p-3 font-medium text-white italic">{item.namaSatwa}</td>
                    <td className="p-3 text-emerald-400 font-bold">{item.totalJumlah} Ekor</td>
                    <td className="p-3">{item.lokasiList.join(", ")}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-950/60 border border-red-900/40 text-red-400">
                        Dilindungi (Prioritas)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-emerald-950 bg-[#07130d] text-slate-300">
                  <th className="p-3 font-semibold">Spesies</th>
                  <th className="p-3 font-semibold">Jumlah</th>
                  <th className="p-3 font-semibold">Pos Pengamatan</th>
                  <th className="p-3 font-semibold">Petugas Pelapor</th>
                  <th className="p-3 font-semibold">Waktu Kejadian</th>
                </tr>
              </thead>
              <tbody>
                {protectedAnimalReports.map((rep) => (
                  <tr key={rep._id} className="border-b border-emerald-950/40 hover:bg-emerald-950/10 text-slate-300">
                    <td className="p-3 font-medium text-white italic">{rep.namaSatwa}</td>
                    <td className="p-3 text-emerald-400 font-bold">{rep.jumlah} Ekor</td>
                    <td className="p-3">{rep.posPengamatan || rep.lokasi}</td>
                    <td className="p-3 text-slate-200">{rep.namaPetugas}</td>
                    <td className="p-3">{new Date(rep.tanggalPengamatan).toLocaleDateString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL PREVIEW DOKUMEN */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#07130d] border border-emerald-900 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Header Modal */}
            <div className="p-4 border-b border-emerald-950 flex justify-between items-center bg-[#040906]">
              <div className="flex items-center gap-2 text-emerald-400">
                <FileText size={18} />
                <h3 className="font-semibold text-sm text-white">Draf Preview Naskah Dinas Kementerian</h3>
              </div>
              <button 
                onClick={() => setIsPreviewOpen(false)}
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

              <div className="space-y-1 text-slate-300">
                <p><strong>Perihal:</strong> {currentPayload.tipeDokumen}</p>
                <p><strong>Tanggal:</strong> {currentPayload.tanggalDibuat}</p>
                <p><strong>Total Satwa Terdaftar:</strong> {currentPayload.totalIndividu} Ekor ({currentPayload.totalKasus} Kasus)</p>
              </div>

              <div className="pt-2">
                <p className="text-slate-400 mb-2 font-sans font-semibold text-[11px]">Daftar Data Terlampir:</p>
                <pre className="bg-[#030705] p-3 rounded-xl border border-emerald-950 text-[11px] overflow-x-auto text-emerald-300">
                  {JSON.stringify(currentPayload.data, null, 2)}
                </pre>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t border-emerald-950 bg-[#040906] flex justify-end gap-3">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl border border-slate-800 hover:bg-slate-900 transition-all"
              >
                Tutup
              </button>
              <button
                onClick={handleSendToMinistry}
                disabled={isSubmitting || submitStatus === "sent"}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 disabled:bg-emerald-900/40 rounded-xl hover:bg-emerald-500 transition-all"
              >
                <Send size={14} /> Send Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};