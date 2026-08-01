"use client";

import { useState } from "react";
import { formatDate } from "@/lib/date";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PencilLine, Trash2, Lock, Eye } from "lucide-react";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

export type ObservationListItem = {
  _id: string;
  namaSatwa: string;
  kategori: string;
  jumlah: number;
  lokasi: string;
  shift: string;
  tanggalPengamatan: string;
  foto: string;
  namaPetugas: string;
  createdBy?: string;
};

type ObservationTableProps = {
  items: ObservationListItem[];
  currentUserId: string;
  deleteAction: (formData: FormData) => Promise<void>;
};

export function ObservationTable({ items, currentUserId, deleteAction }: ObservationTableProps) {
  const router = useRouter();
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const desktopColumns = [
    {
      key: "foto",
      header: "Foto",
      cell: (item: ObservationListItem) => (
        <div className="aspect-video w-32 overflow-hidden rounded-xl bg-surface-card">
          <Image
            src={failedImages[item._id] ?? !item.foto ? "/placeholder.svg" : item.foto}
            alt={item.namaSatwa}
            width={160}
            height={90}
            className="h-full w-full object-cover"
            unoptimized
            onError={() => setFailedImages((prev) => ({ ...prev, [item._id]: true }))}
          />
        </div>
      ),
    },
    {
      key: "namaSatwa",
      header: "Nama Satwa",
      cellClassName: "font-medium text-text-heading",
      cell: (item: ObservationListItem) => item.namaSatwa,
    },
    {
      key: "kategori",
      header: "Kategori",
      cell: (item: ObservationListItem) => item.kategori,
    },
    {
      key: "jumlah",
      header: "Jumlah",
      cell: (item: ObservationListItem) => item.jumlah,
    },
    {
      key: "lokasi",
      header: "Lokasi",
      cell: (item: ObservationListItem) => item.lokasi,
    },
    {
      key: "shift",
      header: "Shift",
      cell: (item: ObservationListItem) => item.shift,
    },
    {
      key: "tanggal",
      header: "Tanggal",
      cell: (item: ObservationListItem) => formatDate(item.tanggalPengamatan),
    },
    {
      key: "petugas",
      header: "Petugas",
      cell: (item: ObservationListItem) => item.namaPetugas,
    },
    {
      key: "statusUpload",
      header: "Status Upload",
      cell: (item: ObservationListItem) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.foto ? "bg-brand-primary/60 text-brand-text-light" : "bg-surface-card text-text-muted"}`}>
          {item.foto ? "Tersedia" : "Belum"}
        </span>
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      headerClassName: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      cell: (item: ObservationListItem) => {
        const isOwner = item.createdBy === currentUserId;
        return (
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/observations/${item._id}`}
              onClick={(e) => e.stopPropagation()}
              className="rounded-full border border-brand-primary/60 p-2 text-brand-text-light transition hover:bg-brand-primary/60"
              title="Detail"
            >
              <Eye className="h-4 w-4" />
            </Link>
            {isOwner ? (
              <>
                <Link
                  href={`/dashboard/observations/edit/${item._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-full border border-brand-primary/60 p-2 text-brand-text transition hover:bg-brand-primary/60 hover:text-text-heading"
                  title="Edit"
                >
                  <PencilLine className="h-4 w-4" />
                </Link>
                <form action={deleteAction} onClick={(e) => e.stopPropagation()}>
                  <input type="hidden" name="id" value={item._id} />
                  <Button
                    type="submit"
                    variant="danger"
                    onClick={(e) => {
                      if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
                        e.preventDefault();
                      }
                    }}
                    className="rounded-full border border-error-bg/60 bg-rose/20 p-2 text-error-dark transition hover:bg-rose/30 hover:text-text-heading"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div
                className="rounded-full border border-border-input p-2 text-text-muted cursor-not-allowed"
                title="Hanya pemilik yang dapat mengedit atau menghapus"
                onClick={(e) => e.stopPropagation()}
              >
                <Lock className="h-4 w-4" />
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* MOBILE CARD LAYOUT */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {items.map((item) => {
          const isOwner = item.createdBy === currentUserId;

          return (
            <div key={item._id} className="rounded-2xl border border-brand-primary/50 bg-surface-table/60 p-4 space-y-4 shadow-sm" onClick={() => router.push(`/dashboard/observations/${item._id}`)}>
              <div className="flex gap-4">
                <div className="aspect-video w-24 overflow-hidden rounded-xl bg-surface-card shrink-0">
                  <Image
                    src={failedImages[item._id] ?? !item.foto ? "/placeholder.svg" : item.foto}
                    alt={item.namaSatwa}
                    width={160}
                    height={90}
                    className="h-full w-full object-cover"
                    unoptimized
                    onError={() => setFailedImages((prev) => ({ ...prev, [item._id]: true }))}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <Link href={`/dashboard/observations/${item._id}`} className="hover:underline">
                      <h4 className="font-semibold text-text-heading">{item.namaSatwa}</h4>
                    </Link>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${item.foto ? "bg-brand-primary/60 text-brand-text-light" : "bg-surface-card text-text-muted"}`}>
                      {item.foto ? "Foto Ada" : "No Foto"}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">{item.kategori}</p>
                  <p className="text-xs font-medium text-brand-text">{item.namaPetugas}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-text-body bg-hover-bg/80 p-3 rounded-xl border border-brand-primary/30">
                <div className="space-y-1">
                  <p className="text-text-muted text-[10px] uppercase tracking-wider">Jumlah</p>
                  <p className="font-medium text-text-heading">{item.jumlah} Ekor</p>
                </div>
                <div className="space-y-1">
                  <p className="text-text-muted text-[10px] uppercase tracking-wider">Shift</p>
                  <p className="font-medium text-text-heading">{item.shift}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-text-muted text-[10px] uppercase tracking-wider">Tanggal</p>
                  <p className="font-medium text-text-heading">{formatDate(item.tanggalPengamatan)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-text-muted text-[10px] uppercase tracking-wider">Lokasi</p>
                  <p className="font-medium text-text-heading truncate">{item.lokasi}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {isOwner ? (
                  <>
                    <Link
                      href={`/dashboard/observations/edit/${item._id}`}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-brand-primary/60 bg-input-bg py-2.5 text-xs font-semibold text-accent-text transition hover:bg-brand-primary/60"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <PencilLine className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <form action={deleteAction} className="flex-1 flex" onClick={(e) => e.stopPropagation()}>
                      <input type="hidden" name="id" value={item._id} />
                      <Button
                        type="submit"
                        variant="danger"
                        onClick={(e) => {
                          if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
                            e.preventDefault();
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-error-bg bg-rose/25 py-2.5 text-xs font-semibold text-error-text transition hover:bg-rose/35"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Hapus
                      </Button>
                    </form>
                  </>
                ) : (
                  <div
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-border-input bg-surface-dark/30 py-2.5 text-xs font-semibold text-text-muted cursor-not-allowed"
                    title="Hanya pemilik yang dapat mengedit atau menghapus"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Lock className="h-3.5 w-3.5" /> Hanya Pemilik
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE LAYOUT */}
      <Table
        data={items}
        columns={desktopColumns}
        rowKey={(item) => item._id}
        onRowClick={(item) => router.push(`/dashboard/observations/${item._id}`)}
        wrapperClassName="hidden md:block w-full overflow-x-auto rounded-2xl border border-brand-primary/60 bg-surface-card/90"
        tableClassName="min-w-[850px] divide-y divide-brand-primary/60 text-sm text-text-secondary"
        theadClassName="bg-brand-primary/50 text-left text-text-body"
        tbodyClassName="divide-y divide-brand-primary/60 bg-hover-bg"
        trClassName={() => "transition hover:bg-brand-primary/15 cursor-pointer"}
      />
    </div>
  );
}
