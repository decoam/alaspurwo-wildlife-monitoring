"use client";

import React from "react";
import { formatDate } from "@/lib/date";
import { User, Calendar, CloudSun } from "lucide-react";
import { ManagerObservationItem } from "./ManagerObservationTable";

interface ObservationDetailModalProps {
  item: ManagerObservationItem | null;
  onClose: () => void;
}

export const ObservationDetailModal: React.FC<ObservationDetailModalProps> = ({
  item,
  onClose,
}) => {
  if (!item) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl rounded-3xl border border-brand-primary/40 bg-surface-dark p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in zoom-in-95 duration-150 cursor-default"
      >
        
        <div className="lg:col-span-6 flex items-center justify-center bg-panel-bg rounded-2xl overflow-hidden border border-brand-primary/30 aspect-square w-full">
          <img 
            src={item.foto || "/placeholder.svg"} 
            alt={item.namaSatwa} 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-brand-text uppercase">
              DETAIL PENGAMATAN
            </p>
            <h1 className="text-3xl font-bold text-text-heading mt-1">{item.namaSatwa}</h1>
          </div>

          <div className="rounded-xl border border-brand-primary/80 bg-panel-bg/60 p-4 space-y-2 text-sm text-text-secondary">
            <div className="flex items-center gap-3">
              <User size={16} className="text-accent-text shrink-0" /> 
              <span>Petugas: <strong className="text-text-heading">{item.namaPetugas}</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-blue-text shrink-0" /> 
              <span>Tanggal: <strong className="text-text-heading">{formatDate(item.tanggalPengamatan)}</strong></span>
            </div>
          </div>

          <div className="rounded-xl border border-brand-primary/80 bg-panel-bg/60 p-4">
            <h3 className="text-sm font-bold text-brand-text mb-3 flex items-center gap-2">
              <CloudSun size={16}/> Informasi Lengkap
            </h3>
            <div className="grid grid-cols-2 gap-y-3 text-xs">
              <div>
                <span className="text-text-muted block">Jumlah Temuan</span>
                <span className="font-semibold text-text-heading text-sm">{item.jumlah} Ekor</span>
              </div>
              <div>
                <span className="text-text-muted block">Cuaca Lapangan</span>
                <span className="font-semibold text-text-heading text-sm">{item.kondisiCuaca || "Mendung"}</span>
              </div>
              <div>
                <span className="text-text-muted block">Pos Pengamatan</span>
                <span className="font-semibold text-text-heading text-sm">{item.posPengamatan || item.lokasi}</span>
              </div>
              <div>
                <span className="text-text-muted block">Gambar</span>
                <span className="font-semibold text-text-heading text-sm">{item.foto ? "Tersedia" : "Tidak Ada"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-brand-primary/80 bg-panel-bg/60 p-4 space-y-1.5">
            <h3 className="text-sm font-bold text-brand-text">Aktivitas & Catatan</h3>
            <p className="text-xs text-text-heading font-medium leading-relaxed break-all">
              {item.aktivitasSatwa || item.catatan || "Tidak ada catatan aktivitas lapangan."}
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-hover-bg text-xs font-semibold text-text-secondary hover:bg-brand-primary/60 transition border border-brand-primary/40 w-full sm:w-auto text-center cursor-pointer"
            >
              Tutup Detail
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
