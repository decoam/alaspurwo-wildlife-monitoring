"use client";

import React from "react";
import { CheckCircle2, Clock, AlertTriangle, Eye } from "lucide-react";

interface ObservationRecord {
  _id: string;
  observerName: string;
  speciesName: string;
  location: string;
  observedAt: string; // Format waktu/tanggal dari DB
  foto?: string;       // Menambahkan dukungan foto satwa dari database
  status: "Terkonfirmasi" | "Pending" | "Darurat";
}

interface LiveObservationTableProps {
  records: ObservationRecord[];
}

export const LiveObservationTable: React.FC<LiveObservationTableProps> = ({ records }) => {
  
  // Helper untuk merender badge status secara dinamis berdasarkan data DB
  const renderStatusBadge = (status: ObservationRecord["status"]) => {
    switch (status) {
      case "Terkonfirmasi":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <CheckCircle2 size={12} />
            Terkonfirmasi
          </span>
        );
      case "Darurat":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 animate-pulse">
            <AlertTriangle size={12} />
            Darurat
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            <Clock size={12} />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-900/60 bg-[#0c1914]/90 shadow-[0_20px_60px_rgba(2,8,23,0.2)]">
      {/* Header Tabel */}
      <div className="border-b border-emerald-900/60 px-5 py-4">
        <h2 className="text-lg font-semibold text-white">Monitoring Laporan Terbaru</h2>
        <p className="mt-1 text-sm text-slate-400">
          Daftar aktivitas pengamatan satwa liar yang masuk dari lapangan.
        </p>
      </div>

      {/* Kontainer Tabel */}
      <div className="overflow-x-auto">
        {records.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-400">
            Belum ada laporan masuk dari lapangan saat ini.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-emerald-900/60 text-sm">
            <thead className="bg-emerald-950/50 text-left text-slate-300">
              <tr>
                <th className="px-5 py-3 font-medium">Foto</th>
                <th className="px-5 py-3 font-medium">Petugas</th>
                <th className="px-5 py-3 font-medium">Nama Satwa</th>
                <th className="px-5 py-3 font-medium">Lokasi</th>
                <th className="px-5 py-3 font-medium">Waktu</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-center font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/50 bg-[#0f2218] text-slate-200">
              {records.map((record) => (
                <tr key={record._id} className="transition hover:bg-emerald-950/40">
                  {/* Kolom Foto Bulat */}
                  <td className="px-5 py-4">
                    {record.foto ? (
                      <img 
                        src={record.foto} 
                        alt={record.speciesName} 
                        className="h-10 w-10 rounded-full object-cover border border-emerald-500/20" 
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900/70 text-lg">
                        🐾
                      </div>
                    )}
                  </td>
                  
                  {/* Nama Petugas */}
                  <td className="px-5 py-4 font-semibold text-slate-100">
                    {record.observerName}
                  </td>

                  {/* Nama Satwa */}
                  <td className="px-5 py-4 font-medium italic text-emerald-300">
                    {record.speciesName}
                  </td>

                  {/* Lokasi */}
                  <td className="px-5 py-4">
                    {record.location}
                  </td>

                  {/* Waktu */}
                  <td className="px-5 py-4 text-xs">
                    {record.observedAt}
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 py-4">
                    {renderStatusBadge(record.status)}
                  </td>

                  {/* Tombol Aksi Verifikasi */}
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => console.log(`Detail laporan ID: ${record._id}`)}
                      className="inline-flex items-center justify-center p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all"
                      title="Lihat Detail & Validasi Laporan"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};