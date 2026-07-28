import React from "react";
import { Table } from "@/components/ui/Table";

type Observation = {
  _id: string;
  namaSatwa: string;
  lokasi: string;
  tanggalPengamatan: string;
  shift: string;
  foto: string;
  status: string;
};

type RecentObservationTableProps = {
  observations: Observation[];
};

export function RecentObservationTable({ observations }: RecentObservationTableProps) {
  const columns = [
    {
      key: "foto",
      header: "Foto",
      cell: (item: Observation) => (
        item.foto ? (
          <img src={item.foto} alt={item.namaSatwa} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/70 text-lg">
            🐾
          </div>
        )
      ),
      headerClassName: "px-5 py-3",
      cellClassName: "px-5 py-4",
    },
    {
      key: "namaSatwa",
      header: "Nama Satwa",
      cell: (item: Observation) => <span className="font-medium text-text-heading">{item.namaSatwa}</span>,
      headerClassName: "px-5 py-3",
      cellClassName: "px-5 py-4",
    },
    {
      key: "lokasi",
      header: "Lokasi",
      cell: (item: Observation) => item.lokasi,
      headerClassName: "px-5 py-3",
      cellClassName: "px-5 py-4",
    },
    {
      key: "shift",
      header: "Shift",
      cell: (item: Observation) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            item.shift === "Pagi"
              ? "bg-amber-bg text-amber-text border border-amber-bg"
              : "bg-blue-bg text-blue-text border border-blue-bg"
          }`}
        >
          {item.shift || "-"}
        </span>
      ),
      headerClassName: "px-5 py-3",
      cellClassName: "px-5 py-4",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-primary/60 bg-surface-subtle/90 shadow-card">
      <div className="border-b border-brand-primary/60 px-5 py-4">
        <h2 className="text-lg font-semibold text-text-heading">Recent Observation</h2>
        <p className="mt-1 text-sm text-text-muted">Aktivitas satwa liar terbaru yang tercatat hari ini.</p>
      </div>
      <Table
        data={observations}
        columns={columns}
        rowKey={(item) => item._id}
        emptyMessage="Belum ada pengamatan yang sesuai pencarian saat ini."
        tableClassName="min-w-full divide-y divide-brand-primary/60 text-sm"
        theadClassName="bg-brand-primary/50 text-left text-text-secondary"
        tbodyClassName="divide-y divide-brand-primary/50 bg-surface-table text-text-body"
        trClassName={() => "transition hover:bg-brand-primary/40"}
      />
    </div>
  );
}
