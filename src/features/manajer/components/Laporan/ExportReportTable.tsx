"use client";

import React from "react";
import { FieldReport } from "./ManageReports";

interface ExportReportTableProps {
  data: FieldReport[];
}

export const ExportReportTable: React.FC<ExportReportTableProps> = ({ data }) => {
  return (
    <div className="hidden print:block w-full">
      <table className="w-full border-collapse border border-slate-400 text-[11px] text-black">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-400 px-3 py-2 text-center font-bold w-12">No</th>
            <th className="border border-slate-400 px-3 py-2 text-left font-bold">Nama Satwa</th>
            <th className="border border-slate-400 px-3 py-2 text-center font-bold w-16">Jumlah</th>
            <th className="border border-slate-400 px-3 py-2 text-left font-bold">Pos & Lokasi</th>
            <th className="border border-slate-400 px-3 py-2 text-left font-bold">Waktu</th>
            <th className="border border-slate-400 px-3 py-2 text-left font-bold">Cuaca</th>
            <th className="border border-slate-400 px-3 py-2 text-left font-bold">Petugas</th>
            <th className="border border-slate-400 px-3 py-2 text-left font-bold w-1/4">Catatan / Aktivitas</th>
          </tr>
        </thead>
        <tbody>
          {data.map((report, idx) => (
            <tr key={report._id} className="align-middle">
              <td className="border border-slate-400 px-3 py-2.5 text-center font-mono">
                {idx + 1}
              </td>
              <td className="border border-slate-400 px-3 py-2.5 italic font-bold">
                {report.namaSatwa}
              </td>
              <td className="border border-slate-400 px-3 py-2.5 text-center">
                {report.jumlah} Ekor
              </td>
              <td className="border border-slate-400 px-3 py-2.5">
                <strong>{report.posPengamatan || report.lokasi}</strong>
                <div className="text-slate-500 font-normal">({report.lokasi})</div>
              </td>
              <td className="border border-slate-400 px-3 py-2.5">
                <div>{new Date(report.tanggalPengamatan).toLocaleDateString("id-ID")}</div>
                <div className="text-slate-500 font-normal">Shift {report.shift}</div>
              </td>
              <td className="border border-slate-400 px-3 py-2.5 capitalize">
                {report.kondisiCuaca || "Cerah"}
              </td>
              <td className="border border-slate-400 px-3 py-2.5">
                {report.namaPetugas}
              </td>
              <td className="border border-slate-400 px-3 py-2.5 italic text-slate-800">
                {report.aktivitasSatwa || report.catatan ? `"${report.aktivitasSatwa || report.catatan}"` : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};