"use client";

import React from "react";
import { MapPin, Calendar } from "lucide-react";

interface ObservationRecord {
  _id: string;
  observerName: string;
  speciesName: string;
  location: string;
  observedAt: string;
  foto?: string;
}

interface LiveObservationTableProps {
  records: ObservationRecord[];
}

export const LiveObservationTable: React.FC<LiveObservationTableProps> = ({ records }) => {
  
  return (
    <div className="overflow-hidden rounded-3xl md:rounded-[28px] border border-brand-primary/60 bg-surface-subtle/90 shadow-[0_20px_60px_rgba(2,8,23,0.2)]">
      {/* Header Tabel */}
      <div className="border-b border-brand-primary/60 px-5 py-5">
        <h2 className="text-base md:text-lg font-semibold text-text-heading">Monitoring Laporan Terbaru</h2>
        <p className="mt-1 text-xs md:text-sm text-text-muted">
          Daftar aktivitas pengamatan satwa liar yang masuk dari lapangan.
        </p>
      </div>

      {records.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-text-muted">
          Belum ada laporan masuk dari lapangan saat ini.
        </div>
      ) : (
        <>
          {/* Tampilan Mobile */}
          <div className="block md:hidden divide-y divide-brand-primary/40 bg-surface-table">
            {records.map((record) => (
              <div key={record._id} className="p-4 flex flex-row items-center justify-between gap-4 hover:bg-brand-primary/20 transition">
                
                {/* SISI KIRI: Foto & Identitas Satwa */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {record.foto ? (
                    <img 
                      src={record.foto} 
                      alt={record.speciesName} 
                      className="h-11 w-11 rounded-xl object-cover border border-brand-hover/20 shrink-0" 
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/70 text-base shrink-0">
                      🐾
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-text-heading text-sm truncate">{record.speciesName}</h3>
                  </div>
                </div>

                {/* SISI KANAN: Lokasi, Tanggal & Shift */}
                <div className="flex flex-col items-end gap-1 text-[11px] text-text-secondary text-right max-w-40 shrink-0">
                  <div className="flex items-center gap-1.5 min-w-0 justify-end">
                    <span className="truncate font-medium text-text-heading">{record.location}</span>
                    <MapPin size={11} className="text-brand-hover shrink-0" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-text-muted justify-end">
                    <span>{record.observedAt}</span>
                    <Calendar size={11} className="text-brand-hover shrink-0" />
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Tampilan Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-primary/60 text-sm table-fixed">
              <thead className="bg-input-bg text-left text-xs font-semibold uppercase tracking-wider text-brand-text">
                <tr>
                  <th className="px-6 py-4 font-medium w-2/12">Foto</th>
                  <th className="px-6 py-4 font-medium w-3/12">Nama Satwa</th>
                  <th className="px-6 py-4 font-medium w-4/12">Lokasi</th>
                  <th className="px-6 py-4 font-medium w-3/12">Tanggal & Shift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/50 bg-[#0f2218] text-text-body">
                {records.map((record) => (
                  <tr key={record._id} className="transition hover:bg-brand-primary/40">
                    <td className="px-6 py-4">
                      {record.foto ? (
                        <img 
                          src={record.foto} 
                          alt={record.speciesName} 
                          className="h-11 w-11 rounded-xl object-cover border border-brand-hover/20 shrink-0" 
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/70 text-lg shrink-0">
                          🐾
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium italic text-brand-text-light truncate">{record.speciesName}</td>
                    <td className="px-6 py-4 truncate">{record.location}</td>
                    <td className="px-6 py-4 text-xs truncate">{record.observedAt}</td>
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