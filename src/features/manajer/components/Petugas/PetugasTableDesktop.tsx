"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { UserType } from "./PetugasManagementTable";

interface PetugasTableDesktopProps {
  users: UserType[];
  initialUsersCount: number;
  openEditModal: (user: UserType) => void;
  openDeleteModal: (user: UserType) => void;
}

export function PetugasTableDesktop({
  users,
  initialUsersCount,
  openEditModal,
  openDeleteModal,
}: PetugasTableDesktopProps) {
  return (
    <div className="hidden md:block overflow-hidden rounded-2xl border border-emerald-900/60 bg-[#0c1914]/85">
      <table className="w-full text-left text-sm text-slate-300 table-fixed">
        <thead className="bg-[#10241a] text-xs font-semibold uppercase tracking-wider text-emerald-400 border-b border-emerald-900/60">
          <tr>
            <th className="px-6 py-4 w-7/12">Nama Lengkap</th>
            <th className="px-6 py-4 w-3/12">Username</th>
            <th className="px-6 py-4 w-2/12 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-950/40">
          {users.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-10 text-center text-slate-500">
                {initialUsersCount === 0
                  ? "Belum ada data petugas lapangan terdaftar."
                  : "Tidak ada hasil pencarian yang sesuai."}
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} className="transition hover:bg-emerald-950/20">
                <td className="px-6 py-4 font-medium text-white truncate">{user.fullName}</td>
                <td className="px-6 py-4 text-slate-400 truncate">@{user.username}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => openEditModal(user)}
                      className="rounded-xl border border-emerald-900/60 bg-[#10241a] p-2 text-emerald-400 transition hover:bg-emerald-900/60"
                      title="Edit Petugas"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="rounded-xl border border-red-900/60 bg-red-950/20 p-2 text-red-400 transition hover:bg-red-950/40"
                      title="Hapus Petugas"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}