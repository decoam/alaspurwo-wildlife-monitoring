"use client";

import React, { useState, useMemo } from "react";
import { 
  FileSpreadsheet, 
  FileText, 
  CheckSquare, 
  Square,
  Info,
  Loader2
} from "lucide-react";
import XLSX from "xlsx-js-style";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
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
  const [filterDate, setFilterDate] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);

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
    if (exportScope === "today") return todayReports;
    if (exportScope === "date") return customDateReports;
    return reports;
  }, [reports, todayReports, customDateReports, exportScope]);

  // Data final yang akan masuk ke generator Excel atau Print PDF
  const dataToExport = useMemo(() => {
    if (exportScope === "today") return todayReports;
    if (exportScope === "selected") return reports.filter((r) => selectedIds.includes(r._id));
    if (exportScope === "date") return customDateReports;
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

  // ==========================================
  // FUNGSI 1: EKSPOR EXCEL TERSTYLING
  // ==========================================
  const handleExportExcel = async () => {
    if (dataToExport.length === 0) {
      toast.error("Tidak ada data untuk diekspor.");
      return;
    }

    const toastId = toast.loading("Sedang menyiapkan file Excel...");
    try {
      setIsExporting(true);

      const totalIndividu = dataToExport.reduce((sum, item) => sum + item.jumlah, 0);

      // Header Meta Info
      const headerMeta = [
        ["KEMENTERIAN LINGKUNGAN HIDUP DAN KEHUTANAN"],
        ["BALAI TAMAN NASIONAL ALAS PURWO"],
        ["LAPORAN OBSERVASI DAN REKAPITULASI SATWA LIAR"],
        [`Cakupan Export: ${exportScope.toUpperCase()}`],
        [],
        ["Tanggal Cetak", ":", new Date().toLocaleDateString("id-ID", { dateStyle: "full" })],
        ["Satuan Kerja", ":", "Balai Taman Nasional Alas Purwo"],
        ["Total Temuan Satwa", ":", `${totalIndividu} Ekor (${dataToExport.length} Laporan/Kasus)`],
        [],
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(headerMeta);

      // Data Tabel
      const tableHeader = [["NO", "NAMA SATWA", "KATEGORI", "JUMLAH (EKOR)", "POS / LOKASI PENGAMATAN", "WAKTU OBSERVASI", "PETUGAS", "CUACA", "CATATAN"]];
      const tableBody = dataToExport.map((rep, idx) => [
        idx + 1,
        rep.namaSatwa,
        rep.kategori,
        rep.jumlah,
        rep.posPengamatan || rep.lokasi,
        `${new Date(rep.tanggalPengamatan).toLocaleDateString("id-ID")} (Shift ${rep.shift})`,
        rep.namaPetugas,
        rep.kondisiCuaca || "Cerah",
        rep.aktivitasSatwa || rep.catatan || "-"
      ]);

      XLSX.utils.sheet_add_aoa(worksheet, tableHeader, { origin: "A10" });
      XLSX.utils.sheet_add_aoa(worksheet, tableBody, { origin: "A11" });

      // Styling Sel
      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
      const thinBorder = {
        top: { style: "thin", color: { rgb: "D1D5DB" } },
        bottom: { style: "thin", color: { rgb: "D1D5DB" } },
        left: { style: "thin", color: { rgb: "D1D5DB" } },
        right: { style: "thin", color: { rgb: "D1D5DB" } },
      };

      for (let r = range.s.r; r <= range.e.r; r++) {
        for (let c = range.s.c; c <= range.e.c; c++) {
          const addr = XLSX.utils.encode_cell({ r, c });
          if (!worksheet[addr]) continue;

          worksheet[addr].s = {
            font: { name: "Calibri", sz: 10 },
            alignment: { vertical: "center", horizontal: "left" },
          };

          // Header Tabel (Baris ke-10 / Index 9)
          if (r === 9) {
            worksheet[addr].s = {
              fill: { fgColor: { rgb: "065F46" } }, // Emerald Dark
              font: { name: "Calibri", sz: 10, bold: true, color: { rgb: "FFFFFF" } },
              alignment: { horizontal: "center", vertical: "center" },
              border: {
                top: { style: "medium", color: { rgb: "064E3B" } },
                bottom: { style: "medium", color: { rgb: "064E3B" } },
                left: { style: "thin", color: { rgb: "064E3B" } },
                right: { style: "thin", color: { rgb: "064E3B" } },
              }
            };
          }

          // Data Tabel (Baris >= 11 / Index 10)
          if (r >= 10) {
            worksheet[addr].s.border = thinBorder;
            if (r % 2 === 1) {
              worksheet[addr].s.fill = { fgColor: { rgb: "F0FDF4" } }; // Zebra Striping Light Green
            }
            if (c === 0 || c === 3 || c === 7) {
              worksheet[addr].s.alignment.horizontal = "center";
            }
          }
        }
      }

      // Title Styling
      worksheet["A1"].s = { font: { name: "Calibri", sz: 13, bold: true, color: { rgb: "064E3B" } }, alignment: { horizontal: "center" } };
      worksheet["A2"].s = { font: { name: "Calibri", sz: 11, bold: true, color: { rgb: "047857" } }, alignment: { horizontal: "center" } };
      worksheet["A3"].s = { font: { name: "Calibri", sz: 10, bold: true, color: { rgb: "111827" } }, alignment: { horizontal: "center" } };

      worksheet["!cols"] = [{ wch: 6 }, { wch: 25 }, { wch: 18 }, { wch: 15 }, { wch: 30 }, { wch: 22 }, { wch: 20 }, { wch: 15 }, { wch: 35 }];
      worksheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 8 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 8 } },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, worksheet, "Laporan Observasi");
      XLSX.writeFile(wb, `Rekap_Observasi_${exportScope}_${new Date().toISOString().slice(0, 10)}.xlsx`);

      toast.success("Ekspor Excel Berhasil", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Gagal Ekspor Excel", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  // ==========================================
  // FUNGSI 2: EKSPOR PDF RESMI (KOP SURAT & AUTOTABLE)
  // ==========================================
  const handleExportPDF = () => {
    if (dataToExport.length === 0) {
      toast.error("Tidak ada data untuk dicetak.");
      return;
    }

    const doc = new jsPDF();
    const totalIndividu = dataToExport.reduce((sum, item) => sum + item.jumlah, 0);

    // Kop Surat KLHK
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(6, 78, 59);
    doc.text("KEMENTERIAN LINGKUNGAN HIDUP DAN KEHUTANAN", 105, 15, { align: "center" });

    doc.setFontSize(11);
    doc.setTextColor(15, 118, 110);
    doc.text("BALAI TAMAN NASIONAL ALAS PURWO", 105, 21, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Seksi Pengelolaan Taman Nasional Wilayah I - Semanjung", 105, 26, { align: "center" });

    // Line Pemisah
    doc.setDrawColor(6, 95, 70);
    doc.setLineWidth(0.8);
    doc.line(14, 29, 196, 29);
    doc.setLineWidth(0.2);
    doc.line(14, 30.2, 196, 30.2);

    // Judul
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text("LAPORAN OBSERVASI LAPANGAN SATWA LIAR", 105, 38, { align: "center" });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    doc.text(`Cakupan Data: ${exportScope.toUpperCase()}`, 105, 43, { align: "center" });

    // Meta Info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(31, 41, 55);
    doc.text(`Tanggal Cetak : ${new Date().toLocaleDateString("id-ID", { dateStyle: "full" })}`, 14, 52);
    doc.text(`Total Temuan   : ${totalIndividu} Ekor (${dataToExport.length} Laporan/Kasus)`, 14, 57);

    // AutoTable PDF
    autoTable(doc, {
      startY: 62,
      head: [["No", "Nama Satwa", "Jumlah", "Pos / Lokasi", "Petugas", "Waktu", "Catatan"]],
      body: dataToExport.map((rep, idx) => [
        idx + 1,
        rep.namaSatwa,
        `${rep.jumlah} Ekor`,
        rep.posPengamatan || rep.lokasi,
        rep.namaPetugas,
        new Date(rep.tanggalPengamatan).toLocaleDateString("id-ID"),
        rep.aktivitasSatwa || rep.catatan || "-"
      ]),
      headStyles: {
        fillColor: [6, 95, 70],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center"
      },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      styles: { fontSize: 8, cellPadding: 3, valign: "middle" },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        2: { halign: "center", cellWidth: 22 },
        5: { halign: "center", cellWidth: 25 },
      },
    });

    // Tanda Tangan
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY || 120;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(31, 41, 55);
    doc.text("Mengetahui,", 140, finalY + 15);
    doc.text("Petugas Penanggung Jawab,", 140, finalY + 20);
    doc.setFont("helvetica", "bold");
    doc.text("( _______________________ )", 140, finalY + 40);

    doc.save(`Laporan_Observasi_${exportScope}_${new Date().toISOString().slice(0, 10)}.pdf`);
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

          {/* Input Tanggal Tambahan */}
          {exportScope === "date" && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl bg-[#040906] border border-emerald-950/60 animate-in fade-in slide-in-from-top-1 duration-200">
              <label 
                htmlFor="filter-date-input" 
                className="text-xs text-slate-400 flex items-center gap-1.5 shrink-0 cursor-pointer select-none"
              >
                Saring Tanggal Observasi:
              </label>
              <input
                id="filter-date-input"
                type="date"
                value={filterDate}
                onClick={(e) => {
                  if ("showPicker" in HTMLInputElement.prototype) {
                    try {
                      e.currentTarget.showPicker();
                    } catch (error) {
                      console.error("Gagal membuka date picker:", error);
                    }
                  }
                }}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-[#ffffff] border border-emerald-900/60 rounded-lg px-3 py-1.5 text-xs text-black focus:outline-none focus:border-emerald-500 transition-colors w-full sm:w-auto cursor-pointer"
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
                disabled={isExporting || dataToExport.length === 0}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 rounded-xl hover:bg-emerald-900/30 transition-all flex-1 sm:flex-initial disabled:opacity-50"
              >
                {isExporting ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
                Simpan Excel
              </button>
              <button
                onClick={handleExportPDF}
                disabled={dataToExport.length === 0}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-all flex-1 sm:flex-initial disabled:opacity-50"
              >
                <FileText size={14} /> Cetak PDF
              </button>
            </div>
          </div>
        </div>

        {/* Toggle Select All */}
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
            const [year, month, day] = dateKey.split("-").map(Number);
            const formattedDate = new Date(year, month - 1, day).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric"
            });

            return (
              <div key={dateKey} className="space-y-3">
                <div className="flex items-center gap-3 px-1 pt-2">
                  <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                    {formattedDate}
                  </span>
                  <div className="h-px bg-emerald-950/60 flex-1" />
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-500/80 border border-emerald-900/30">
                    {reportsInDate.length} Laporan
                  </span>
                </div>

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