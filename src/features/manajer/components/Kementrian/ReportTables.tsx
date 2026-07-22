"use client";

import React from "react";
import { FieldReport } from "../Laporan/ManageReports";

interface MonthlySummaryItem {
  namaSatwa: string;
  totalJumlah: number;
  lokasiList: string[];
}

interface ReportTablesProps {
  documentType: "BULANAN" | "BAP";
  monthlySummary: MonthlySummaryItem[];
  protectedAnimalReports: FieldReport[];
}

export const ReportTables: React.FC<ReportTablesProps> = ({
  documentType,
  monthlySummary,
  protectedAnimalReports,
}) => {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold tracking-wider text-emerald-400 uppercase px-1">
        {documentType === "BULANAN"
          ? "Tabel Akumulasi Populasi Bulanan (Format KLHK 01)"
          : "Tabel Berita Acara Perjumpaan Lapangan (Format BAP KLHK 02)"}
      </h4>

      <div className="overflow-x-auto rounded-xl border border-emerald-950 bg-[#040906]">
        {documentType === "BULANAN" ? (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-emerald-950 bg-[#07130d] text-slate-300">
                <th className="p-3 font-semibold">Spesies Prioritas</th>
                <th className="p-3 font-semibold">Akumulasi Populasi</th>
                <th className="p-3 font-semibold">Pos Pengamatan</th>
                <th className="p-3 font-semibold">Status Perlindungan</th>
              </tr>
            </thead>
            <tbody>
              {monthlySummary.map((item, idx) => (
                <tr key={idx} className="border-b border-emerald-950/40 hover:bg-emerald-950/10 text-slate-300">
                  <td className="p-3 font-medium text-white italic">{item.namaSatwa}</td>
                  <td className="p-3 text-emerald-400 font-bold">{item.totalJumlah} Ekor</td>
                  <td className="p-3">{item.lokasiList.join(", ")}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-950/60 border border-red-900/40 text-red-400">
                      Dilindungi (Prioritas)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-emerald-950 bg-[#07130d] text-slate-300">
                <th className="p-3 font-semibold">Spesies</th>
                <th className="p-3 font-semibold">Jumlah</th>
                <th className="p-3 font-semibold">Pos Pengamatan</th>
                <th className="p-3 font-semibold">Petugas Pelapor</th>
                <th className="p-3 font-semibold">Waktu Kejadian</th>
              </tr>
            </thead>
            <tbody>
              {protectedAnimalReports.map((rep) => (
                <tr key={rep._id} className="border-b border-emerald-950/40 hover:bg-emerald-950/10 text-slate-300">
                  <td className="p-3 font-medium text-white italic">{rep.namaSatwa}</td>
                  <td className="p-3 text-emerald-400 font-bold">{rep.jumlah} Ekor</td>
                  <td className="p-3">{rep.posPengamatan || rep.lokasi}</td>
                  <td className="p-3 text-slate-200">{rep.namaPetugas}</td>
                  <td className="p-3">
                    {new Date(rep.tanggalPengamatan).toLocaleDateString("id-ID")}
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