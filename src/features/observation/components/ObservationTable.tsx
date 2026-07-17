"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, PencilLine, Trash2, Lock } from "lucide-react";

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
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-900/60 bg-[#08140e]/90">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-emerald-900/60 text-sm text-slate-300">
          <thead className="bg-emerald-950/50 text-left text-slate-200">
            <tr>
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Nama Satwa</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Jumlah</th>
              <th className="px-4 py-3">Lokasi</th>
              <th className="px-4 py-3">Shift</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Petugas</th>
              <th className="px-4 py-3">Status Upload</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-900/60 bg-[#0d1d14]">
            {items.map((item) => {
              const isOwner = item.createdBy === currentUserId;

              return (
                <tr key={item._id} className="transition hover:bg-emerald-950/30">
                  <td className="px-4 py-3">
                    <Image
                      src={failedImages[item._id] ?? !item.foto ? "/placeholder.svg" : item.foto}
                      alt={item.namaSatwa}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-xl object-cover"
                      unoptimized
                      onError={() => setFailedImages((prev) => ({ ...prev, [item._id]: true }))}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{item.namaSatwa}</td>
                  <td className="px-4 py-3">{item.kategori}</td>
                  <td className="px-4 py-3">{item.jumlah}</td>
                  <td className="px-4 py-3">{item.lokasi}</td>
                  <td className="px-4 py-3">{item.shift}</td>
                  <td className="px-4 py-3">
                    {new Date(item.tanggalPengamatan).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-3">{item.namaPetugas}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.foto ? "bg-emerald-900/60 text-emerald-200" : "bg-slate-800 text-slate-400"}`}>
                      {item.foto ? "Tersedia" : "Belum"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">

                      {/* Tombol detail — semua bisa lihat */}
                      <Link
                        href={`/dashboard/observations/${item._id}`}
                        className="rounded-full border border-emerald-900/60 p-2 text-emerald-200 transition hover:bg-emerald-900/60"
                        title="Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      {/* Tombol edit & hapus — hanya pemilik */}
                      {isOwner ? (
                        <>
                          <Link
                            href={`/dashboard/observations/edit/${item._id}`}
                            className="rounded-full border border-emerald-900/60 p-2 text-sky-200 transition hover:bg-emerald-900/60"
                            title="Edit"
                          >
                            <PencilLine className="h-4 w-4" />
                          </Link>
                          <form action={deleteAction}>
                            <input type="hidden" name="id" value={item._id} />
                            <button
                              type="submit"
                              onClick={(e) => {
                                if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
                                  e.preventDefault();
                                }
                              }}
                              className="rounded-full border border-rose-900/60 p-2 text-rose-200 transition hover:bg-rose-900/50"
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </form>
                        </>
                      ) : (
                        /* Tampilkan ikon kunci untuk data milik orang lain */
                        <div
                          className="rounded-full border border-slate-800 p-2 text-slate-600 cursor-not-allowed"
                          title="Hanya pemilik yang dapat mengedit atau menghapus"
                        >
                          <Lock className="h-4 w-4" />
                        </div>
                      )}

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}