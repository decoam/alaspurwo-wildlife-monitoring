"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, PencilLine, Trash2, Lock } from "lucide-react";
import { formatDate } from "@/lib/date";

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
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* MOBILE CARD LAYOUT */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {items.map((item) => {
          const isOwner = item.createdBy === currentUserId;

          return (
            <div key={item._id} className="rounded-2xl border border-emerald-900/50 bg-[#0f2218]/60 p-4 space-y-4 shadow-sm">
              <div className="flex gap-4">
                <Image
                  src={failedImages[item._id] ?? !item.foto ? "/placeholder.svg" : item.foto}
                  alt={item.namaSatwa}
                  width={96}
                  height={64}
                  className="h-16 w-24 rounded-xl object-cover shrink-0"
                  unoptimized
                  onError={() => setFailedImages((prev) => ({ ...prev, [item._id]: true }))}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <Link href={`/dashboard/observations/${item._id}`} className="hover:underline">
                      <h4 className="font-semibold text-white">{item.namaSatwa}</h4>
                    </Link>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${item.foto ? "bg-emerald-900/60 text-emerald-200" : "bg-slate-800 text-slate-400"}`}>
                      {item.foto ? "Foto Ada" : "No Foto"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{item.kategori}</p>
                  <p className="text-xs font-medium text-emerald-400">{item.namaPetugas}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-[#08140e]/80 p-3 rounded-xl border border-emerald-900/30">
                <div className="space-y-1">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider">Jumlah</p>
                  <p className="font-medium text-white">{item.jumlah} Ekor</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider">Shift</p>
                  <p className="font-medium text-white">{item.shift}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider">Tanggal</p>
                  <p className="font-medium text-white">{formatDate(item.tanggalPengamatan)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider">Lokasi</p>
                  <p className="font-medium text-white truncate">{item.lokasi}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {isOwner ? (
                  <>
                    <Link
                      href={`/dashboard/observations/edit/${item._id}`}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-emerald-900/60 bg-[#10241a] py-2.5 text-xs font-semibold text-sky-400 transition hover:bg-emerald-900/60"
                    >
                      <PencilLine className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <form action={deleteAction} className="flex-1 flex">
                      <input type="hidden" name="id" value={item._id} />
                      <button
                        type="submit"
                        onClick={(e) => {
                          if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
                            e.preventDefault();
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-rose-900/60 bg-rose-950/20 py-2.5 text-xs font-semibold text-rose-400 transition hover:bg-rose-950/40"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Hapus
                      </button>
                    </form>
                  </>
                ) : (
                  <div
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/30 py-2.5 text-xs font-semibold text-slate-500 cursor-not-allowed"
                    title="Hanya pemilik yang dapat mengedit atau menghapus"
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
      <div className="hidden md:block overflow-hidden rounded-2xl border border-emerald-900/60 bg-[#08140e]/90">
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
                <tr 
                  key={item._id} 
                  className="transition hover:bg-emerald-950/30 cursor-pointer"
                  onClick={() => router.push(`/dashboard/observations/${item._id}`)}
                >
                  <td className="px-4 py-3">
                    <Image
                      src={failedImages[item._id] ?? !item.foto ? "/placeholder.svg" : item.foto}
                      alt={item.namaSatwa}
                      width={96}
                      height={64}
                      className="h-16 w-24 rounded-xl object-cover"
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
                    {formatDate(item.tanggalPengamatan)}
                  </td>
                  <td className="px-4 py-3">{item.namaPetugas}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.foto ? "bg-emerald-900/60 text-emerald-200" : "bg-slate-800 text-slate-400"}`}>
                      {item.foto ? "Tersedia" : "Belum"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">

                      {/* Tombol edit & hapus — hanya pemilik */}
                      {isOwner ? (
                        <>
                          <Link
                            href={`/dashboard/observations/edit/${item._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-full border border-emerald-900/60 p-2 text-sky-200 transition hover:bg-emerald-900/60"
                            title="Edit"
                          >
                            <PencilLine className="h-4 w-4" />
                          </Link>
                          <form action={deleteAction} onClick={(e) => e.stopPropagation()}>
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
                          onClick={(e) => e.stopPropagation()}
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
  </div>
  );
}