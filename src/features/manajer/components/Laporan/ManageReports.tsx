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
import { ExportReportTable } from "./ExportReportTable";
import { ReportCardItem } from "./ReportCardItem";
import { FieldReport, getLocalDateString } from "@/features/manajer/ReportUtils";
import { exportToExcel, exportToPDF } from "@/features/manajer/ExportServices";

interface ManageReportsProps {
  initialReports: FieldReport[];
}

export const ManageReports: React.FC<ManageReportsProps> = ({ initialReports }) => {
  const [reports] = useState<FieldReport[]>(initialReports);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exportScope, setExportScope] = useState<"all" | "today" | "selected" | "date">("all");
  const [filterDate, setFilterDate] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);

  const todayReports = useMemo(() => {
    const todayStr = getLocalDateString(new Date());
    return reports.filter(rep => getLocalDateString(rep.tanggalPengamatan) === todayStr);
  }, [reports]);

  const customDateReports = useMemo(() => {
    if (!filterDate) return [];
    return reports.filter(rep => getLocalDateString(rep.tanggalPengamatan) === filterDate);
  }, [reports, filterDate]);

  const listToShow = useMemo(() => {
    if (exportScope === "today") return todayReports;
    if (exportScope === "date") return customDateReports;
    return reports;
  }, [reports, todayReports, customDateReports, exportScope]);

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

  const groupedReports = useMemo(() => {
    const groups: { [key: string]: FieldReport[] } = {};
    listToShow.forEach((report) => {
      const dateKey = getLocalDateString(report.tanggalPengamatan);
      if (!dateKey) return;
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(report);
    });
    return groups;
  }, [listToShow]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedReports).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [groupedReports]);

  return (
    <div className="space-y-6 p-4 md:p-6 bg-[#060d0a] text-slate-200 print:bg-white print:text-black print:p-0 print:m-0">
      
      {/* HEADER & CONTROLS */}
      <div className="print:hidden space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-emerald-900/40 pb-5">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white mt-1">Cetak & Export Laporan Lapangan</h1>
            <p className="text-xs text-slate-400 mt-1">
              Pilih cakupan baris data observasi satwa liar Taman Nasional Alas Purwo untuk disimpan ke Excel atau PDF.
            </p>
          </div>
        </div>

        {/* Panel Filter */}
        <div className="p-5 rounded-2xl border border-emerald-900/40 bg-[#07130d] space-y-4">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-emerald-500" />
            <span className="text-xs font-semibold text-white">Tentukan Cakupan Data Yang Akan Diekspor:</span>
          </div>

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
                    try { e.currentTarget.showPicker(); } catch (err) { console.error(err); }
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
                onClick={() => exportToExcel(dataToExport, exportScope, setIsExporting)}
                disabled={isExporting || dataToExport.length === 0}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 rounded-xl hover:bg-emerald-900/30 transition-all flex-1 sm:flex-initial disabled:opacity-50"
              >
                {isExporting ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
                Simpan Excel
              </button>
              <button
                onClick={() => exportToPDF(dataToExport, exportScope)}
                disabled={dataToExport.length === 0}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-all flex-1 sm:flex-initial disabled:opacity-50"
              >
                <FileText size={14} /> Cetak PDF
              </button>
            </div>
          </div>
        </div>

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

      {/* CARDS LIST */}
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

      {/* PRINT TABLE */}
      <ExportReportTable data={dataToExport} />

    </div>
  );
};