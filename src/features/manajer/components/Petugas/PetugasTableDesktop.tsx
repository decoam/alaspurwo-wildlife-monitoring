"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { UserType } from "./PetugasManagementTable";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

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
  const columns = [
    {
      key: "fullName",
      header: "Nama Lengkap",
      headerClassName: "w-7/12",
      cellClassName: "font-medium text-text-heading truncate",
      cell: (user: UserType) => user.fullName,
    },
    {
      key: "username",
      header: "Username",
      headerClassName: "w-3/12",
      cellClassName: "text-text-muted truncate",
      cell: (user: UserType) => `@${user.username}`,
    },
    {
      key: "aksi",
      header: "Aksi",
      headerClassName: "w-2/12 text-right",
      cellClassName: "text-right",
      cell: (user: UserType) => (
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => openEditModal(user)}
            className="!px-2 !py-2 rounded-xl"
            title="Edit Petugas"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            onClick={() => openDeleteModal(user)}
            className="!px-2 !py-2 rounded-xl"
            title="Hapus Petugas"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="hidden md:block overflow-hidden rounded-2xl border border-brand-primary/60 bg-surface-subtle/85">
      <Table
        data={users}
        columns={columns}
        rowKey={(user) => user._id}
        emptyMessage={
          initialUsersCount === 0
            ? "Belum ada data petugas lapangan terdaftar."
            : "Tidak ada hasil pencarian yang sesuai."
        }
        tableClassName="w-full text-left text-sm text-text-secondary table-fixed"
        theadClassName="bg-input-bg text-xs font-semibold uppercase tracking-wider text-brand-text border-b border-brand-primary/60"
        tbodyClassName="divide-y divide-brand-primary/40"
        trClassName={() => "transition hover:bg-brand-primary/20"}
      />
    </div>
  );
}
