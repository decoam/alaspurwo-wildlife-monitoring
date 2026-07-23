"use client";

import React from "react";
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
    /* OVERLAY / BACKDROP: Klik di area latar mana saja akan memicu onClose */
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 cursor-pointer"
    >
      {/* KARTU MODAL: e.stopPropagation() mencegah modal tertutup jika area dalam modal diklik */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl rounded-3xl border border-emerald-900/40 bg-[#040e0a] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in zoom-in-95 duration-150 cursor-default"
      >
        
        {/* SISI KIRI: Foto modal Aspect-Square */}
        <div className="lg:col-span-6 flex items-center justify-center bg-[#07140e] rounded-2xl overflow-hidden border border-emerald-900/30 aspect-square w-full">
          <img 
            src={item.foto || "/placeholder.svg"} 
            alt={item.namaSatwa} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* SISI KANAN: Detail Data */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
              DETAIL PENGAMATAN
            </p>
            <h1 className="text-3xl font-bold text-white mt-1">{item.namaSatwa}</h1>
          </div>

          {/* Blok Petugas & Lokasi */}
          <div className="rounded-xl border border-emerald-950 bg-[#07140e]/60 p-4 space-y-2 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <User size={16} className="text-emerald-500 shrink-0" /> 
              <span>Petugas: <strong className="text-white">{item.namaPetugas}</strong></span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-emerald-500 shrink-0" /> 
              <span>Tanggal: <strong className="text-white">{new Date(item.tanggalPengamatan).toLocaleDateString("id-ID")}</strong></span>
            </div>
          </div>

          {/* Informasi Lengkap */}
          <div className="rounded-xl border border-emerald-950 bg-[#07140e]/60 p-4">
            <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
              <CloudSun size={16}/> Informasi Lengkap
            </h3>
            <div className="grid grid-cols-2 gap-y-3 text-xs">
              <div>
                <span className="text-slate-500 block">Jumlah Temuan</span>
                <span className="font-semibold text-white text-sm">{item.jumlah} Ekor</span>
              </div>
              <div>
                <span className="text-slate-500 block">Cuaca Lapangan</span>
                <span className="font-semibold text-white text-sm">{item.kondisiCuaca || "Mendung"}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Pos Pengamatan</span>
                <span className="font-semibold text-white text-sm">{item.posPengamatan || item.lokasi}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Gambar</span>
                <span className="font-semibold text-white text-sm">{item.foto ? "Tersedia" : "Tidak Ada"}</span>
              </div>
            </div>
          </div>

          {/* Aktivitas & Catatan */}
          <div className="rounded-xl border border-emerald-950 bg-[#07140e]/60 p-4 space-y-1.5">
            <h3 className="text-sm font-bold text-emerald-400">Aktivitas & Catatan</h3>
            <p className="text-xs text-white font-medium leading-relaxed break-all">
              {item.aktivitasSatwa || item.catatan || "Tidak ada catatan aktivitas lapangan."}
            </p>
          </div>

          {/* Tombol Tutup Utama */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#0b1c13] text-xs font-semibold text-slate-300 hover:bg-emerald-950/60 transition border border-emerald-900/40 w-full sm:w-auto text-center cursor-pointer"
            >
              Tutup Detail
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};