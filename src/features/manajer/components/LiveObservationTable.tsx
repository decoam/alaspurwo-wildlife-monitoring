import React from "react";
import { CheckCircle2, Clock, AlertTriangle, Eye } from "lucide-react";

interface ObservationRecord {
  _id: string;
  observerName: string;
  speciesName: string;
  location: string;
  observedAt: string; // Format waktu/tanggal dari DB
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
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={12} />
            Terkonfirmasi
          </span>
        );
      case "Darurat":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-1 text-xs font-medium text-rose-400 border border-rose-500/20 animate-pulse">
            <AlertTriangle size={12} />
            Darurat
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-400 border border-amber-500/20">
            <Clock size={12} />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="rounded-3xl border border-emerald-900/40 bg-[#07110c]/50 p-6 shadow-md w-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-200">
            Monitoring Laporan Terbaru
          </h3>
          <p className="text-xs text-slate-500">
            Daftar aktivitas pengamatan satwa liar yang masuk dari lapangan[cite: 1]
          </p>
        </div>
      </div>

      {/* Kontainer Tabel Responshif */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-[#040a07] text-xs uppercase tracking-wider text-emerald-400/80 border-b border-emerald-900/30">
            <tr>
              <th className="px-4 py-3.5 font-semibold">Petugas</th>
              <th className="px-4 py-3.5 font-semibold">Satwa</th>
              <th className="px-4 py-3.5 font-semibold">Lokasi Pos</th>
              <th className="px-4 py-3.5 font-semibold">Waktu</th>
              <th className="px-4 py-3.5 font-semibold">Status</th>
              <th className="px-4 py-3.5 text-center font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-900/20">
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-500 text-xs">
                  Tidak ada laporan masuk saat ini.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record._id} className="hover:bg-emerald-950/10 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-slate-200">
                    {record.observerName}
                  </td>
                  <td className="px-4 py-3.5 italic text-emerald-300">
                    {record.speciesName}
                  </td>
                  <td className="px-4 py-3.5 text-slate-400">
                    {record.location}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-400">
                    {record.observedAt}
                  </td>
                  <td className="px-4 py-3.5">
                    {renderStatusBadge(record.status)}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {/* Tombol Aksi Cepat Manajer */}
                    <button
                      onClick={() => console.log(`Detail laporan ID: ${record._id}`)}
                      className="inline-flex items-center justify-center p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all"
                      title="Lihat Detail & Validasi Laporan"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};