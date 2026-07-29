"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Calendar, User, CheckSquare, Square } from "lucide-react";
import { FieldReport } from "@/features/manajer/ReportUtils";

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
      className={`relative p-4 rounded-xl border bg-surface-card/95 transition-all select-none ${
        isSelectedTab 
          ? "cursor-pointer hover:border-brand-hover/80" 
          : "cursor-default border-brand-primary/30"
      } ${isSelected && isSelectedTab ? "border-brand-hover bg-brand-primary/20" : "border-brand-primary/60"}`}
    >
      <div className={`flex flex-col md:flex-row md:items-center gap-4 ${isSelectedTab ? "pr-10 md:pr-12" : ""}`}>
        
        {/* Checkbox di posisi tengah kanan secara presisi */}
        {isSelectedTab && (
          <div className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center justify-center shrink-0 z-10">
            {isSelected ? (
              <CheckSquare size={20} className="text-brand-hover transition-transform scale-110" />
            ) : (
              <Square size={20} className="text-text-muted hover:text-text-secondary transition-colors" />
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
                  className="h-12 w-12 rounded-lg object-cover border border-brand-hover/10"
                  unoptimized
                  onError={() => setImageError(true)}
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-text-heading italic truncate">{report.namaSatwa}</h3>
                <div className="text-[11px] text-text-muted mt-0.5 flex items-center gap-1.5 truncate">
                  <User size={11} className="text-accent-text shrink-0" />
                  <span>Petugas: <strong className="text-text-body font-normal">{report.namaPetugas}</strong></span>
                </div>
              </div>
            </div>

            <div className="shrink-0 pl-2">
              <span className="inline-block px-2 py-0.5 rounded-md bg-brand-primary/80 border border-brand-hover/20 text-brand-text font-semibold text-[10px]">
                {report.jumlah} Ekor
              </span>
            </div>
          </div>

          {/* Kolom Penempatan Lokasi & Tanggal */}
          <div className="md:col-span-4 space-y-1.5 md:border-l md:border-brand-primary/60 md:pl-5 text-[11px] text-text-secondary border-t md:border-t-0 border-brand-primary/30 pt-3 md:pt-0">
            <div className="flex items-start gap-1.5">
              <MapPin size={12} className="text-amber-text shrink-0 mt-0.5" />
              <div className="leading-tight">
                <span className="font-semibold text-text-light">{report.posPengamatan || report.lokasi}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-blue-text shrink-0" />
              <span>{formatDate(report.tanggalPengamatan)} | Shift {report.shift}</span>
            </div>
          </div>

          {/* Kolom Catatan / Aktivitas */}
          <div className="md:col-span-3 text-[11px] text-text-muted italic md:text-right border-t md:border-t-0 border-brand-primary/40 pt-2.5 md:pt-0">
            {report.aktivitasSatwa || report.catatan ? (
              <span className="line-clamp-2">"{report.aktivitasSatwa || report.catatan}"</span>
            ) : (
              <span className="text-text-muted">-</span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};