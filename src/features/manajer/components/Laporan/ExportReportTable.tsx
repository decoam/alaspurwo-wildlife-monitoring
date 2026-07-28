"use client";

import React from "react";
import { formatDate } from "@/lib/date";
import { FieldReport } from "@/features/manajer/ReportUtils";
import { Table } from "@/components/ui/Table";

interface ExportReportTableProps {
  data: FieldReport[];
}

export const ExportReportTable: React.FC<ExportReportTableProps> = ({ data }) => {
  const columns = [
    {
      key: "no",
      header: "No",
      headerClassName: "text-center w-12 font-bold",
      cellClassName: "text-center font-mono",
      cell: (_: FieldReport, idx: number) => idx + 1,
    },
    {
      key: "namaSatwa",
      header: "Nama Satwa",
      headerClassName: "text-left font-bold",
      cellClassName: "italic font-bold",
      cell: (report: FieldReport) => report.namaSatwa,
    },
    {
      key: "jumlah",
      header: "Jumlah",
      headerClassName: "text-center w-16 font-bold",
      cellClassName: "text-center",
      cell: (report: FieldReport) => `${report.jumlah} Ekor`,
    },
    {
      key: "lokasi",
      header: "Pos & Lokasi",
      headerClassName: "text-left font-bold",
      cell: (report: FieldReport) => (
        <>
          <strong>{report.posPengamatan || report.lokasi}</strong>
          <div className="text-text-muted font-normal">({report.lokasi})</div>
        </>
      ),
    },
    {
      key: "waktu",
      header: "Waktu",
      headerClassName: "text-left font-bold",
      cell: (report: FieldReport) => (
        <>
          <div>
            {report.tanggalPengamatan
              ? formatDate(report.tanggalPengamatan)
              : "-"}
          </div>
          <div className="text-text-muted font-normal">Shift {report.shift}</div>
        </>
      ),
    },
    {
      key: "cuaca",
      header: "Cuaca",
      headerClassName: "text-left font-bold",
      cellClassName: "capitalize",
      cell: (report: FieldReport) => report.kondisiCuaca || "Cerah",
    },
    {
      key: "petugas",
      header: "Petugas",
      headerClassName: "text-left font-bold",
      cell: (report: FieldReport) => report.namaPetugas,
    },
    {
      key: "catatan",
      header: "Catatan / Aktivitas",
      headerClassName: "text-left w-1/4 font-bold",
      cellClassName: "italic text-text-body",
      cell: (report: FieldReport) => report.aktivitasSatwa || report.catatan ? `"${report.aktivitasSatwa || report.catatan}"` : "-",
    },
  ];

  return (
    <div className="hidden print:block w-full">
      <Table
        data={data}
        columns={columns}
        rowKey={(report) => report._id}
        tableClassName="w-full border-collapse border border-border-input text-xs text-black"
        theadClassName="bg-slate-100 border border-border-input"
        tbodyClassName=""
        trClassName={() => "align-middle border border-border-input"}
      />
    </div>
  );
};
