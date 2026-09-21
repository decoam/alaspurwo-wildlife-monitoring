"use client";

import React from "react";
import { formatDate } from "@/lib/date";
import { FieldReport } from "@/features/manajer/ReportUtils";
import { Table } from "@/components/ui/Table";

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
  const bulananColumns = [
    {
      key: "namaSatwa",
      header: "Spesies Prioritas",
      cell: (item: MonthlySummaryItem) => <span className="font-medium text-text-heading italic">{item.namaSatwa}</span>,
    },
    {
      key: "totalJumlah",
      header: "Akumulasi Populasi",
      cellClassName: "text-brand-text font-bold",
      cell: (item: MonthlySummaryItem) => `${item.totalJumlah} Ekor`,
    },
    {
      key: "lokasiList",
      header: "Pos Pengamatan",
      cell: (item: MonthlySummaryItem) => item.lokasiList.join(", "),
    },
    {
      key: "status",
      header: "Status Perlindungan",
      headerClassName: "text-center sm:text-left",
      cellClassName: "text-center sm:text-left",
      cell: () => (
        <div className="inline-flex flex-col items-center justify-center px-2.5 py-1 rounded-lg bg-error-bg border-error-bg text-error-text shadow-sm leading-tight text-center">
          <span className="font-semibold text-xs tracking-wide">Dilindungi</span>
          <span className="text-xs opacity-80 font-normal">(Prioritas)</span>
        </div>
      ),
    },
  ];

  const bapColumns = [
    {
      key: "namaSatwa",
      header: "Spesies",
      cell: (rep: FieldReport) => <span className="font-medium text-text-heading italic">{rep.namaSatwa}</span>,
    },
    {
      key: "jumlah",
      header: "Jumlah",
      cellClassName: "text-brand-text font-bold",
      cell: (rep: FieldReport) => `${rep.jumlah} Ekor`,
    },
    {
      key: "posPengamatan",
      header: "Pos Pengamatan",
      cell: (rep: FieldReport) => rep.posPengamatan || rep.lokasi,
    },
    {
      key: "namaPetugas",
      header: "Petugas Pelapor",
      cellClassName: "text-text-body",
      cell: (rep: FieldReport) => rep.namaPetugas,
    },
    {
      key: "waktuKejadian",
      header: "Waktu Kejadian",
      cell: (rep: FieldReport) => formatDate(rep.tanggalPengamatan),
    },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold tracking-wider text-brand-text uppercase px-1">
        {documentType === "BULANAN"
          ? "Tabel Akumulasi Populasi Bulanan (Format KLHK 01)"
          : "Tabel Berita Acara Perjumpaan Lapangan (Format BAP KLHK 02)"}
      </h4>

      <div className="overflow-x-auto rounded-xl border border-brand-primary/80 bg-surface-dark">
        {documentType === "BULANAN" ? (
          <Table
            data={monthlySummary}
            columns={bulananColumns}
            rowKey={(_, idx) => String(idx)}
            emptyMessage="Tidak ada data laporan akumulasi bulanan."
            tableClassName="w-full text-left border-collapse text-xs"
            theadClassName="border-b border-brand-primary/80 bg-panel-bg text-text-secondary"
            tbodyClassName="text-text-secondary"
            trClassName={() => "border-b border-brand-primary/40 hover:bg-brand-primary/10"}
          />
        ) : (
          <Table
            data={protectedAnimalReports}
            columns={bapColumns}
            rowKey={(rep) => rep._id}
            emptyMessage="Tidak ada data laporan perjumpaan lapangan (BAP)."
            tableClassName="w-full text-left border-collapse text-xs"
            theadClassName="border-b border-brand-primary/80 bg-panel-bg text-text-secondary"
            tbodyClassName="text-text-secondary"
            trClassName={() => "border-b border-brand-primary/40 hover:bg-brand-primary/10"}
          />
        )}
      </div>
    </div>
  );
};
