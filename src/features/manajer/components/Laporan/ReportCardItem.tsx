"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Calendar, User, CheckSquare, Square } from "lucide-react";
import { FieldReport } from "./ManageReports";

interface ReportCardItemProps {
  report: FieldReport;
  isSelected: boolean;
  isSelectedTab: boolean;
  onSelect: (id: string) => void;
}

export const ReportCardItem: React.FC<ReportCardItemProps> = ({
  report,
  isSelected,
  isSelectedTab,
  onSelect,
}) => {
  const [imageError, setImageError] = useState(false);

  // Validasi tanggal agar aman dari Invalid Date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const parsedDate = new Date(dateStr);
    if (isNaN(parsedDate.getTime())) return "-";
    return parsedDate.toLocaleDateString("id-ID");
  };

  return (
    <div
      onClick={() => isSelectedTab && onSelect(report._id)}
      className={`relative p-4 rounded-xl border bg-[#08140e]/95 transition-all select-none ${
        isSelectedTab 
          ? "cursor-pointer hover:border-emerald-500/80" 
          : "cursor-default border-emerald-900/30"
      } ${isSelected && isSelectedTab ? "border-emerald-500 bg-emerald-950/20" : "border-emerald-900/60"}`}
    >
      <div className={`flex flex-col md:flex-row md:items-center gap-4 ${isSelectedTab ? "pr-8 md:pr-0" : ""}`}>
        
        {isSelectedTab && (
          <div className="absolute top-4 right-4 md:relative md:top-auto md:right-auto md:flex md:items-center md:justify-center md:px-2 md:shrink-0">
            {isSelected ? (
              <CheckSquare size={20} className="text-emerald-500 transition-transform scale-110" />
            ) : (
              <Square size={20} className="text-slate-500 hover:text-slate-400 transition-colors" />
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center w-full">
          
          {/* Kolom Info Satwa & Petugas */}
          <div className="md:col-span-5 flex items-center justify-between gap-3.5 min-w-0">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="shrink-0">
                <Image
                  src={imageError || !report.foto ? "/placeholder.svg" : report.foto}
                  alt={report.namaSatwa}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-lg object-cover border border-emerald-500/10"
                  unoptimized
                  onError={() => setImageError(true)}
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white italic truncate">{report.namaSatwa}</h3>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5 truncate">
                  <User size={11} className="text-emerald-500/80 shrink-0" />
                  <span>Petugas: <strong className="text-slate-200 font-normal">{report.namaPetugas}</strong></span>
                </div>
              </div>
            </div>

            <div className="shrink-0 pl-2">
              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                {report.jumlah} Ekor
              </span>
            </div>
          </div>

          {/* Kolom Penempatan Lokasi & Tanggal */}
          <div className="md:col-span-4 space-y-1.5 md:border-l md:border-emerald-950/60 md:pl-5 text-[11px] text-slate-300 border-t md:border-t-0 border-emerald-950/30 pt-3 md:pt-0">
            <div className="flex items-start gap-1.5">
              <MapPin size={12} className="text-emerald-500 shrink-0 mt-0.5" />
              <div className="leading-tight">
                <span className="font-semibold text-slate-100">{report.posPengamatan || report.lokasi}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-emerald-500 shrink-0" />
              <span>{formatDate(report.tanggalPengamatan)} | Shift {report.shift}</span>
            </div>
          </div>

          {/* Kolom Catatan / Aktivitas */}
          <div className="md:col-span-3 text-[11px] text-slate-400 italic md:text-right border-t md:border-t-0 border-emerald-950/40 pt-2.5 md:pt-0">
            {report.aktivitasSatwa || report.catatan ? (
              <span className="line-clamp-2">"{report.aktivitasSatwa || report.catatan}"</span>
            ) : (
              <span className="text-slate-600">-</span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};