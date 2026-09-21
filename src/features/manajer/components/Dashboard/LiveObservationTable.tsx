"use client";

import React from "react";
import { MapPin, Calendar } from "lucide-react";
import { Table } from "@/components/ui/Table";


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
  const columns = [
    {
      key: "foto",
      header: "Foto",
      cell: (record: ObservationRecord) => (
        record.foto ? (
          <img 
            src={record.foto} 
            alt={record.speciesName} 
            className="h-11 w-11 rounded-xl object-cover border border-brand-hover/20 shrink-0" 
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/70 text-lg shrink-0">
            🐾
          </div>
        )
      ),
      headerClassName: "px-6 py-4 w-2/12",
      cellClassName: "px-6 py-4",
    },
    {
      key: "namaSatwa",
      header: "Nama Satwa",
      cell: (record: ObservationRecord) => <span className="font-medium italic text-brand-text-light truncate">{record.speciesName}</span>,
      headerClassName: "px-6 py-4 w-3/12",
      cellClassName: "px-6 py-4",
    },
    {
      key: "lokasi",
      header: "Lokasi",
      cell: (record: ObservationRecord) => <span className="truncate">{record.location}</span>,
      headerClassName: "px-6 py-4 w-4/12",
      cellClassName: "px-6 py-4 truncate",
    },
    {
      key: "observedAt",
      header: "Tanggal & Shift",
      cell: (record: ObservationRecord) => <span className="text-xs truncate">{record.observedAt}</span>,
      headerClassName: "px-6 py-4 w-3/12",
      cellClassName: "px-6 py-4",
    },
  ];

  return (
    <div className="overflow-hidden rounded-3xl md:rounded-[28px] border border-brand-primary/60 bg-surface-subtle/90 shadow-card">
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
          <div className="block md:hidden divide-y divide-brand-primary/40 bg-surface-table">
            {records.map((record) => (
              <div key={record._id} className="p-4 flex flex-row items-center justify-between gap-4 hover:bg-brand-primary/20 transition">
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
                <div className="flex flex-col items-end gap-1 text-xs text-text-secondary text-right max-w-40 shrink-0">
                  <div className="flex items-center gap-1.5 min-w-0 justify-end">
                    <span className="truncate font-medium text-text-heading">{record.location}</span>
                    <MapPin size={11} className="text-amber-text shrink-0" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted justify-end">
                    <span>{record.observedAt}</span>
                    <Calendar size={11} className="text-blue-text shrink-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Table
            data={records}
            columns={columns}
            rowKey={(item) => item._id}
            wrapperClassName="hidden md:block overflow-x-auto"
            tableClassName="min-w-full divide-y divide-brand-primary/60 text-sm table-fixed"
            theadClassName="bg-input-bg text-left text-xs font-semibold uppercase tracking-wider text-brand-text"
            tbodyClassName="divide-y divide-brand-primary/50 bg-surface-table text-text-body"
            trClassName={() => "transition hover:bg-brand-primary/40"}
          />
        </>
      )}
    </div>
  );
};
