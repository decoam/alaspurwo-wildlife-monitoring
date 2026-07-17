"use client";

import React from "react";
import { CheckCircle2, Clock, AlertTriangle, Eye, MapPin, Calendar, User } from "lucide-react";

interface ObservationRecord {
  _id: string;
  observerName: string;
  speciesName: string;
  location: string;
  observedAt: string;
  foto?: string;
  status: "Terkonfirmasi" | "Pending" | "Darurat";
}

interface LiveObservationTableProps {
  records: ObservationRecord[];
}

export const LiveObservationTable: React.FC<LiveObservationTableProps> = ({ records }) => {
  
  const renderStatusBadge = (status: ObservationRecord["status"]) => {
    switch (status) {
      case "Terkonfirmasi":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
            <CheckCircle2 size={12} />
            Terkonfirmasi
          </span>
        );
      case "Darurat":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400 animate-pulse">
            <AlertTriangle size={12} />
            Darurat
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
            <Clock size={12} />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl md:rounded-[28px] border border-emerald-900/60 bg-[#0c1914]/90 shadow-[0_20px_60px_rgba(2,8,23,0.2)]">
      {/* Header Tabel */}
      <div className="border-b border-emerald-900/60 px-5 py-5">
        <h2 className="text-base md:text-lg font-semibold text-white">Monitoring Laporan Terbaru</h2>
        <p className="mt-1 text-xs md:text-sm text-slate-400">
          Daftar aktivitas pengamatan satwa liar yang masuk dari lapangan.
        </p>
      </div>

      {records.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-slate-400">
          Belum ada laporan masuk dari lapangan saat ini.
        </div>
      ) : (
        <>
          {/* Tampilan Mobile */}
          <div className="block md:hidden divide-y divide-emerald-900/40 bg-[#0f2218]">
            {records.map((record) => (
              <div key={record._id} className="p-4 space-y-4 hover:bg-emerald-950/20 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
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
                    <div>
                      <h3 className="font-semibold text-white text-sm">{record.speciesName}</h3>
                      <p className="text-xs text-emerald-400 italic font-medium">Spesies Terdeteksi</p>
                    </div>
                  </div>
                  {renderStatusBadge(record.status)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-emerald-950/40 p-3 rounded-xl border border-emerald-900/30">
                  <div className="flex items-center gap-1.5 truncate">
                    <User size={12} className="text-emerald-500 shrink-0" />
                    <span className="truncate">{record.observerName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin size={12} className="text-emerald-500 shrink-0" />
                    <span className="truncate">{record.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2 mt-1 border-t border-emerald-900/20 pt-1 text-[11px] text-slate-400">
                    <Calendar size={12} className="text-emerald-500 shrink-0" />
                    <span>{record.observedAt}</span>
                  </div>
                </div>

                <button
                  onClick={() => console.log(`Detail laporan ID: ${record._id}`)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#10241a] border border-emerald-800/40 text-emerald-400 hover:bg-emerald-500 hover:text-black text-xs font-semibold transition"
                >
                  <Eye size={14} />
                  Lihat Detail & Validasi
                </button>
              </div>
            ))}
          </div>

          {/* Tampilan Dekstop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-900/60 text-sm">
              <thead className="bg-[#10241a] text-left text-xs font-semibold uppercase tracking-wider text-emerald-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Foto</th>
                  <th className="px-6 py-4 font-medium">Petugas</th>
                  <th className="px-6 py-4 font-medium">Nama Satwa</th>
                  <th className="px-6 py-4 font-medium">Lokasi</th>
                  <th className="px-6 py-4 font-medium">Tanggal & Shift</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-center font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/50 bg-[#0f2218] text-slate-200">
                {records.map((record) => (
                  <tr key={record._id} className="transition hover:bg-emerald-950/40">
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4 font-semibold text-slate-100">{record.observerName}</td>
                    <td className="px-6 py-4 font-medium italic text-emerald-300">{record.speciesName}</td>
                    <td className="px-6 py-4">{record.location}</td>
                    <td className="px-6 py-4 text-xs">{record.observedAt}</td>
                    <td className="px-6 py-4">{renderStatusBadge(record.status)}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => console.log(`Detail laporan ID: ${record._id}`)}
                        className="inline-flex items-center justify-center p-2 rounded-xl bg-[#10241a] border border-emerald-800/40 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all"
                        title="Lihat Detail & Validasi Laporan"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};