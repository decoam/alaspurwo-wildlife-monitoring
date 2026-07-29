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
    <div className="hidden md:block overflow-hidden rounded-2xl border border-brand-primary/60 bg-surface-subtle/85">
      <table className="w-full text-left text-sm text-text-secondary table-fixed">
        <thead className="bg-input-bg text-xs font-semibold uppercase tracking-wider text-brand-text border-b border-brand-primary/60">
          <tr>
            <th className="px-6 py-4 w-7/12">Nama Lengkap</th>
            <th className="px-6 py-4 w-3/12">Username</th>
            <th className="px-6 py-4 w-2/12 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-primary/40">
          {users.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-10 text-center text-text-muted">
                {initialUsersCount === 0
                  ? "Belum ada data petugas lapangan terdaftar."
                  : "Tidak ada hasil pencarian yang sesuai."}
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} className="transition hover:bg-brand-primary/20">
                <td className="px-6 py-4 font-medium text-text-heading truncate">{user.fullName}</td>
                <td className="px-6 py-4 text-text-muted truncate">@{user.username}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => openEditModal(user)}
                      className="rounded-xl border border-brand-primary/60 bg-input-bg p-2 text-brand-text transition hover:bg-brand-primary/60 hover:text-text-heading"
                      title="Edit Petugas"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(user)}
                      className="rounded-xl border border-error-bg bg-rose/25 p-2 text-error-text transition hover:bg-rose/35 hover:text-text-heading"
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