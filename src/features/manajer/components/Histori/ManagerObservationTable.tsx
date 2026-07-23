"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, X, User, Calendar, MapPin, CloudSun } from "lucide-react";

export type ManagerObservationItem = {
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

type ManagerObservationTableProps = {
  items: ManagerObservationItem[];
};

export function ManagerObservationTable({ items }: ManagerObservationTableProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<ManagerObservationItem | null>(null);

  return (
    <div className="space-y-4">
      {/* WRAPPER TABEL UTAMA */}
      <div className="overflow-hidden rounded-2xl border border-emerald-900/60 bg-[#08140e]/90">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-emerald-900/60 text-sm text-slate-300">
            <thead className="bg-emerald-950/50 text-left text-slate-200">
              <tr>
                <th className="px-4 py-3 w-17.5">Foto</th>
                <th className="px-4 py-3">Nama Satwa</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3 hidden md:table-cell">Jumlah</th>
                <th className="px-4 py-3 hidden md:table-cell">Lokasi</th>
                <th className="px-4 py-3 hidden md:table-cell">Shift</th>
                <th className="px-4 py-3 hidden md:table-cell">Tanggal</th>
                <th className="px-4 py-3">Petugas</th>
                <th className="px-4 py-3 hidden md:table-cell">Status Upload</th>
                <th className="px-4 py-3 text-center w-15">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/60 bg-[#0d1d14]">
              {items.map((item) => (
                <tr key={item._id} className="transition hover:bg-emerald-950/30">
                  <td className="px-4 py-3">
                    <div className="shrink-0">
                      <Image
                        src={failedImages[item._id] || !item.foto ? "/placeholder.svg" : item.foto}
                        alt={item.namaSatwa}
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-xl object-cover border border-emerald-500/20 shrink-0"
                        unoptimized
                        onError={() => setFailedImages((prev) => ({ ...prev, [item._id]: true }))}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{item.namaSatwa}</td>
                  <td className="px-4 py-3">{item.kategori}</td>
                  
                  <td className="px-4 py-3 hidden md:table-cell">{item.jumlah}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{item.lokasi}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{item.shift}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{new Date(item.tanggalPengamatan).toLocaleDateString("id-ID")}</td>
                  
                  <td className="px-4 py-3">{item.namaPetugas}</td>
                  
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.foto ? "bg-emerald-900/60 text-emerald-200" : "bg-slate-800 text-slate-400"}`}>
                      {item.foto ? "Tersedia" : "Belum"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="rounded-full border border-emerald-900/60 p-2 text-emerald-200 transition hover:bg-emerald-900/60"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POP UP MODAL DETAIL VIEW */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-5xl rounded-3xl border border-emerald-900/40 bg-[#040e0a] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in zoom-in-95 duration-150">
            
            <button 
              onClick={() => setSelectedItem(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-[#0b1c13] border border-emerald-900/40 transition z-10"
            >
              <X size={20} />
            </button>

            {/* SISI KIRI: Foto modal dibuat Aspect-Square Persegi Rapi */}
            <div className="lg:col-span-6 flex items-center justify-center bg-[#07140e] rounded-2xl overflow-hidden border border-emerald-900/30 aspect-square w-full">
              <img 
                src={selectedItem.foto || "/placeholder.svg"} 
                alt={selectedItem.namaSatwa} 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* SISI KANAN: Detail Data */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              <div>
                <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase">DETAIL PENGAMATAN</p>
                <h1 className="text-3xl font-bold text-white mt-1">{selectedItem.namaSatwa}</h1>
              </div>

              {/* Blok Petugas & Lokasi */}
              <div className="rounded-xl border border-emerald-950 bg-[#07140e]/60 p-4 space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-3"><User size={16} className="text-emerald-500 shrink-0" /> <span>Petugas: <strong className="text-white">{selectedItem.namaPetugas}</strong></span></div>
                <div className="flex items-center gap-3"><Calendar size={16} className="text-emerald-500 shrink-0" /> <span>Tanggal: <strong className="text-white">{new Date(selectedItem.tanggalPengamatan).toLocaleDateString("id-ID")}</strong></span></div>
              </div>

              {/* Informasi Lengkap */}
              <div className="rounded-xl border border-emerald-950 bg-[#07140e]/60 p-4">
                <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2"><CloudSun size={16}/> Informasi Lengkap</h3>
                <div className="grid grid-cols-2 gap-y-3 text-xs">
                  <div><span className="text-slate-500 block">Jumlah Temuan</span><span className="font-semibold text-white text-sm">{selectedItem.jumlah} Ekor</span></div>
                  <div><span className="text-slate-500 block">Cuaca Lapangan</span><span className="font-semibold text-white text-sm">{selectedItem.kondisiCuaca || "Mendung"}</span></div>
                  <div><span className="text-slate-500 block">Pos Pengamatan</span><span className="font-semibold text-white text-sm">{selectedItem.posPengamatan || selectedItem.lokasi}</span></div>
                  <div><span className="text-slate-500 block">Gambar</span><span className="font-semibold text-white text-sm">{selectedItem.foto ? "Tersedia" : "Tidak Ada"}</span></div>
                </div>
              </div>

              {/* Aktivitas & Catatan */}
              <div className="rounded-xl border border-emerald-950 bg-[#07140e]/60 p-4 space-y-1.5">
                <h3 className="text-sm font-bold text-emerald-400">Aktivitas & Catatan</h3>
                <p className="text-xs text-white font-medium leading-relaxed break-all">
                  {selectedItem.aktivitasSatwa || selectedItem.catatan || "Tidak ada catatan aktivitas lapangan."}
                </p>
              </div>

              {/* Tombol Tutup */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 rounded-xl bg-[#0b1c13] text-xs font-semibold text-slate-300 hover:bg-emerald-950/60 transition border border-emerald-900/40 w-full sm:w-auto text-center"
                >
                  Tutup Detail
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}