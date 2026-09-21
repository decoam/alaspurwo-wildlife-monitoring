"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import { formatDate } from "@/lib/date";
import { ObservationDetailModal } from "./ObservationDetailModal";
import { Table } from "@/components/ui/Table";

export type ManagerObservationItem = {
  _id: string;
  namaSatwa: string;
  kategori: string;
  jumlah: number;
  lokasi: string;
  shift: string;
  tanggalPengamatan: string;
  foto: string;
  namaPetugas: string;
  kondisiCuaca?: string;
  posPengamatan?: string;
  catatan?: string;
  aktivitasSatwa?: string;
};

type ManagerObservationTableProps = {
  items: ManagerObservationItem[];
};

export function ManagerObservationTable({ items }: ManagerObservationTableProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<ManagerObservationItem | null>(null);

  const columns = [
    {
      key: "foto",
      header: "Foto",
      headerClassName: "w-17.5",
      cell: (item: ManagerObservationItem) => (
        <div className="shrink-0">
          <Image
            src={failedImages[item._id] || !item.foto ? "/placeholder.svg" : item.foto}
            alt={item.namaSatwa}
            width={44}
            height={44}
            className="h-11 w-11 rounded-xl object-cover border border-brand-hover/20 shrink-0"
            unoptimized
            onError={() => setFailedImages((prev) => ({ ...prev, [item._id]: true }))}
          />
        </div>
      ),
    },
    {
      key: "namaSatwa",
      header: "Nama Satwa",
      cell: (item: ManagerObservationItem) => <span className="font-medium text-text-heading">{item.namaSatwa}</span>,
    },
    {
      key: "kategori",
      header: "Kategori",
      cell: (item: ManagerObservationItem) => item.kategori,
    },
    {
      key: "jumlah",
      header: "Jumlah",
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
      cell: (item: ManagerObservationItem) => item.jumlah,
    },
    {
      key: "lokasi",
      header: "Lokasi",
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
      cell: (item: ManagerObservationItem) => item.lokasi,
    },
    {
      key: "shift",
      header: "Shift",
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
      cell: (item: ManagerObservationItem) => item.shift,
    },
    {
      key: "tanggalPengamatan",
      header: "Tanggal",
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
      cell: (item: ManagerObservationItem) => formatDate(item.tanggalPengamatan),
    },
    {
      key: "namaPetugas",
      header: "Petugas",
      cell: (item: ManagerObservationItem) => item.namaPetugas,
    },
    {
      key: "statusUpload",
      header: "Status Upload",
      headerClassName: "hidden md:table-cell",
      cellClassName: "hidden md:table-cell",
      cell: (item: ManagerObservationItem) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.foto ? "bg-brand-primary/60 text-brand-text-light" : "bg-surface-card text-text-muted"}`}>
          {item.foto ? "Tersedia" : "Belum"}
        </span>
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      headerClassName: "text-center w-15",
      cellClassName: "text-center",
      cell: () => (
        <div 
          className="inline-flex rounded-full border border-brand-primary/60 p-2 text-brand-text-light transition hover:bg-brand-primary/60"
          title="Lihat Detail"
        >
          <Eye className="h-4 w-4" />
        </div>
      ),
    }
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-brand-primary/60 bg-surface-card/90">
        <Table
          data={items}
          columns={columns}
          rowKey={(item) => item._id}
          onRowClick={(item) => setSelectedItem(item)}
          tbodyClassName="divide-y divide-brand-primary/60 bg-hover-bg"
          theadClassName="bg-brand-primary/50 text-left text-text-body"
          trClassName={() => "transition cursor-pointer hover:bg-brand-primary/30 active:bg-brand-primary/50"}
        />
      </div>

      <ObservationDetailModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </div>
  );
}
