"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import { ObservationDetailModal } from "./ObservationDetailModal";

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
                <tr 
                  key={item._id} 
                  onClick={() => setSelectedItem(item)}
                  className="transition cursor-pointer hover:bg-emerald-900/30 active:bg-emerald-900/50"
                >
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
                  <td className="px-4 py-3 hidden md:table-cell">
                    {new Date(item.tanggalPengamatan).toLocaleDateString("id-ID")}
                  </td>
                  
                  <td className="px-4 py-3">{item.namaPetugas}</td>
                  
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.foto ? "bg-emerald-900/60 text-emerald-200" : "bg-slate-800 text-slate-400"}`}>
                      {item.foto ? "Tersedia" : "Belum"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div 
                      className="inline-flex rounded-full border border-emerald-900/60 p-2 text-emerald-200 transition hover:bg-emerald-900/60"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PENGGUNAAN KOMPONEN MODAL YANG DIPISAH */}
      <ObservationDetailModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </div>
  );
}