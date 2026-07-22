"use client";

import React, { useState, useMemo } from "react";
import { 
  FileSpreadsheet, 
  FileText, 
  CheckSquare, 
  Square,
  Info
} from "lucide-react";
import { ExportReportTable } from "./ExportReportTable";
import { ReportCardItem } from "./ReportCardItem";

export type FieldReport = {
  _id: string;
  namaSatwa: string;
  kategori: string;
  jumlah: number;
  lokasi: string;
  shift: string;
  tanggalPengamatan: string;
  foto: string;
  namaPetugas: string;
  kondisiCuaca?: string;
  posPengamatan?: string;
  catatan?: string;
  aktivitasSatwa?: string;
};

interface ManageReportsProps {
  initialReports: FieldReport[];
}

const getLocalDateString = (dateInput?: string | Date): string => {
  const d = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(d.getTime())) return "";
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  
  return `${year}-${month}-${day}`;
};

export const ManageReports: React.FC<ManageReportsProps> = ({ initialReports }) => {
  const [reports] = useState<FieldReport[]>(initialReports);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exportScope, setExportScope] = useState<"all" | "today" | "selected" | "date">("all");
  // State untuk menyimpan tanggal filter pilihan user
  const [filterDate, setFilterDate] = useState<string>("");

  // Menggunakan perbandingan string
  const todayReports = useMemo(() => {
    const todayStr = getLocalDateString(new Date());
    return reports.filter(rep => getLocalDateString(rep.tanggalPengamatan) === todayStr);
  }, [reports]);

  // Filter laporan berdasarkan tanggal spesifik
  const customDateReports = useMemo(() => {
    if (!filterDate) return [];
    return reports.filter(rep => {
      const repDate = getLocalDateString(rep.tanggalPengamatan);
      return repDate === filterDate;
    });
  }, [reports, filterDate]);

  // Tab atau cakupan yang aktif menentukan apa saja daftar kartu yang bisa terlihat
  const listToShow = useMemo(() => {
    if (exportScope === "today") {
      return todayReports;
    }
    if (exportScope === "date") {
      return customDateReports;
    }
    return reports;
  }, [reports, todayReports, customDateReports, exportScope]);

  // Data final yang akan masuk ke generator Excel atau Print PDF
  const dataToExport = useMemo(() => {
    if (exportScope === "today") {
      return todayReports;
    }
    if (exportScope === "selected") {
      return reports.filter((r) => selectedIds.includes(r._id));
    }
    if (exportScope === "date") {
      return customDateReports;
    }
    return reports;
  }, [reports, todayReports, customDateReports, selectedIds, exportScope]);

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === reports.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(reports.map((r) => r._id));
    }
  };

  const handleExportExcel = () => {
    if (dataToExport.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }
    const headers = ["ID Laporan", "Nama Satwa", "Kategori", "Jumlah", "Lokasi", "Pos", "Shift", "Tanggal", "Petugas", "Cuaca", "Catatan"];
    const rows = dataToExport.map((r) => [
      r._id,
      r.namaSatwa,
      r.kategori,
      r.jumlah,
      r.lokasi,
      r.posPengamatan || r.lokasi,
      r.shift,
      new Date(r.tanggalPengamatan).toLocaleDateString("id-ID"),
      r.namaPetugas,
      r.kondisiCuaca || "Cerah",
      `"${(r.aktivitasSatwa || r.catatan || "-").replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Rekap_Observasi_${exportScope}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    if (dataToExport.length === 0) {
      alert("Tidak ada data untuk dicetak.");
      return;
    }
    window.print();
  };

  // Helper logic untuk mengelompokkan laporan berdasarkan tanggal YYYY-MM-DD lokal
  const groupedReports = useMemo(() => {
    const groups: { [key: string]: FieldReport[] } = {};
    listToShow.forEach((report) => {
      const dateKey = getLocalDateString(report.tanggalPengamatan);
      if (!dateKey) return;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(report);
    });
    return groups;
  }, [listToShow]);

  // Urutan tanggal terkompilasi dari yang paling baru ke terlama
  const sortedDates = useMemo(() => {
    return Object.keys(groupedReports).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [groupedReports]);

  return (
    <div className="space-y-6 p-4 md:p-6 bg-[#060d0a] text-slate-200 print:bg-white print:text-black print:p-0 print:m-0">
      
      {/* ==================== ONLY WEB VIEW: HEADER & CONTROLS ==================== */}
      <div className="print:hidden space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-emerald-900/40 pb-5">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1">Cetak & Export Laporan Lapangan</h1>
            <p className="text-xs text-slate-400 mt-1">
              Pilih cakupan baris data observasi satwa liar Taman Nasional Alas Purwo untuk disimpan ke Excel atau PDF.
            </p>
          </div>
        </div>

        {/* Panel Filter Cakupan */}
        <div className="p-5 rounded-2xl border border-emerald-900/40 bg-[#07130d] space-y-4">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-emerald-500" />
            <span className="text-xs font-semibold text-white">Tentukan Cakupan Data Yang Akan Diekspor:</span>
          </div>

          {/* Grid Tab Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-1 bg-[#040906] rounded-xl border border-emerald-950">
            <button
              type="button"
              onClick={() => setExportScope("all")}
              className={`py-2 px-4 rounded-lg text-xs font-medium transition-all ${
                exportScope === "all" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Semua Laporan ({reports.length})
            </button>
            <button
              type="button"
              onClick={() => setExportScope("today")}
              className={`py-2 px-4 rounded-lg text-xs font-medium transition-all ${
                exportScope === "today" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Hari Ini ({todayReports.length})
            </button>
            <button
              type="button"
              onClick={() => setExportScope("date")}
              className={`py-2 px-4 rounded-lg text-xs font-medium transition-all ${
                exportScope === "date" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Pilih Tanggal ({customDateReports.length})
            </button>
            <button
              type="button"
              onClick={() => setExportScope("selected")}
              className={`py-2 px-4 rounded-lg text-xs font-medium transition-all ${
                exportScope === "selected" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Pilihan Saja ({selectedIds.length})
            </button>
          </div>

          {/* Input Tanggal Tambahan - Hanya tampil saat tab "Pilih Tanggal" aktif */}
          {exportScope === "date" && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl bg-[#040906] border border-emerald-950/60 animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="text-xs text-slate-400 flex items-center gap-1.5 shrink-0">
                Saring Tanggal Observasi:
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-[#ffffff] border border-emerald-900/60 rounded-lg px-3 py-1.5 text-xs text-black focus:outline-none focus:border-emerald-500 transition-colors w-full sm:w-auto"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 border-t border-emerald-950 gap-4">
            <div className="text-xs text-slate-400">
              Menyiapkan <strong className="text-emerald-400">{dataToExport.length}</strong> data observasi untuk diexport.
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportExcel}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 rounded-xl hover:bg-emerald-900/30 transition-all flex-1 sm:flex-initial"
              >
                <FileSpreadsheet size={14} /> Simpan Excel
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-all flex-1 sm:flex-initial"
              >
                <FileText size={14} /> Cetak PDF
              </button>
            </div>
          </div>
        </div>

        {/* Toggle Select All (Hanya Muncul di Tab "Pilihan Saja") */}
        {exportScope === "selected" && (
          <div className="flex items-center gap-2 px-2">
            <button
              onClick={handleSelectAll}
              className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-medium transition"
            >
              {selectedIds.length === reports.length ? (
                <CheckSquare size={16} className="text-emerald-500" />
              ) : (
                <Square size={16} />
              )}
              Pilih Semua Baris ({selectedIds.length} terpilih)
            </button>
          </div>
        )}
      </div>

      {/* ==================== SCREEN ONLY: CARDS LIST ==================== */}
      <div className="space-y-6 print:hidden">
        {listToShow.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-sm border border-dashed border-emerald-900/40 rounded-2xl">
            {exportScope === "date" && !filterDate 
              ? "Silakan pilih tanggal terlebih dahulu pada input di atas." 
              : "Tidak ada laporan."}
          </div>
        ) : (
          sortedDates.map((dateKey) => {
            const reportsInDate = groupedReports[dateKey];
            // Mencegah timezone offset pada tampilan header tanggal
            const [year, month, day] = dateKey.split("-").map(Number);
            const formattedDate = new Date(year, month - 1, day).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric"
            });

            return (
              <div key={dateKey} className="space-y-3">
                {/* Header Tanggal */}
                <div className="flex items-center gap-3 px-1 pt-2">
                  <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                    {formattedDate}
                  </span>
                  <div className="h-[1px] bg-emerald-950/60 flex-1" />
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-500/80 border border-emerald-900/30">
                    {reportsInDate.length} Laporan
                  </span>
                </div>

                {/* List Kartu Laporan */}
                <div className="space-y-3">
                  {reportsInDate.map((report) => (
                    <ReportCardItem
                      key={report._id}
                      report={report}
                      isSelected={selectedIds.includes(report._id)}
                      isSelectedTab={exportScope === "selected"}
                      onSelect={handleSelectRow}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ==================== PRINT ONLY: TABEL BERGARIS ==================== */}
      <ExportReportTable data={dataToExport} />

    </div>
  );
};