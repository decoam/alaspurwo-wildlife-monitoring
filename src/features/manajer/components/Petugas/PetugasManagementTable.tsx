"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Edit2, Trash2, Search, User } from "lucide-react";
import { PetugasModal } from "./PetugasModal";
import { PetugasTableDesktop } from "./PetugasTableDesktop";

// DEFINISI TIPE DATA DI-EXPORT DARI SINI
export type UserType = {
  _id: string;
  fullName: string;
  username: string;
  role: string;
};

export type ModalType = "add" | "edit" | "delete" | null;

type PetugasManagementTableProps = {
  initialUsers: UserType[];
};

export function PetugasManagementTable({ initialUsers }: PetugasManagementTableProps) {
  const router = useRouter();
  
  // State Utama
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State Modal Controlling
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // State Form Input
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Filter data berdasarkan search query
  const filteredUsers = initialUsers.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modal Triggers
  const openAddModal = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setFullName("");
    setUsername("");
    setPassword("");
    setShowPassword(false);
    setModalType("add");
  };

  const openEditModal = (user: UserType) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setSelectedUser(user);
    setFullName(user.fullName);
    setUsername(user.username);
    setPassword("");
    setShowPassword(false);
    setModalType("edit");
  };

  const openDeleteModal = (user: UserType) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setSelectedUser(user);
    setModalType("delete");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedUser(null);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // API Actions
  const handleAddPetugas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !password) {
      setErrorMsg("Semua field wajib diisi.");
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambahkan petugas.");

      setSuccessMsg("Petugas baru berhasil didaftarkan!");
      setTimeout(() => {
        closeModal();
        router.refresh();
      }, 1500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPetugas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !fullName || !username) {
      setErrorMsg("Nama dan Username tidak boleh kosong.");
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/manajer/petugas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedUser._id, fullName, username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui data.");

      setSuccessMsg("Data petugas berhasil diperbarui!");
      setTimeout(() => {
        closeModal();
        router.refresh();
      }, 1500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePetugas = async () => {
    if (!selectedUser) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/manajer/petugas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedUser._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus petugas.");

      setSuccessMsg("Akun petugas berhasil dihapus.");
      setTimeout(() => {
        closeModal();
        router.refresh();
      }, 1500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-emerald-900/60 bg-[#0c1914]/85 p-4 sm:p-6 shadow-xl space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            DATA PERSONEL
          </p>
          <h2 className="text-xl font-semibold text-white mt-0.5">Daftar Akun Petugas Lapangan</h2>
          <p className="text-sm text-slate-400 mt-1">
            Manajemen kredensial, dan pendaftaran personel baru, petugas observasi lapangan Taman Nasional Alas Purwo.
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={openAddModal}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-600 to-lime-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-emerald-500 hover:to-lime-500 shadow-md"
          >
            <UserPlus className="h-4 w-4" />
            Tambah Petugas
          </button>
        </div>
      </div>

      <hr className="border-emerald-900/40" />

      {/* SEARCH BAR */}
      <div className="flex items-center gap-2 rounded-2xl border border-emerald-900/60 bg-[#10241a] px-4 py-2.5 text-sm text-slate-400 max-w-md w-full">
        <Search className="h-4 w-4 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent outline-none placeholder:text-slate-500 text-white"
          placeholder="Cari nama atau username..."
        />
      </div>

      {/* MOBILE LIST CARD */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            {initialUsers.length === 0
              ? "Belum ada data petugas lapangan terdaftar."
              : "Tidak ada hasil pencarian yang sesuai."}
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div 
              key={user._id} 
              className="rounded-2xl border border-emerald-900/50 bg-[#0f2218]/60 p-4 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-900/50 text-emerald-400">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white">{user.fullName}</h4>
                    <p className="text-xs text-slate-400">@{user.username}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="flex items-center justify-center p-2 rounded-xl border border-emerald-900/60 bg-[#10241a] text-emerald-400 transition hover:bg-emerald-900/60"
                    title="Edit"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(user)}
                    className="flex items-center justify-center p-2 rounded-xl border border-red-900/60 bg-red-950/20 text-red-400 transition hover:bg-red-950/40"
                    title="Hapus"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE COMPONENT */}
      <PetugasTableDesktop
        users={filteredUsers}
        initialUsersCount={initialUsers.length}
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
      />

      {/* MODAL COMPONENT */}
      <PetugasModal
        modalType={modalType}
        selectedUser={selectedUser}
        fullName={fullName}
        setFullName={setFullName}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        errorMsg={errorMsg}
        successMsg={successMsg}
        isLoading={isLoading}
        closeModal={closeModal}
        handleAddPetugas={handleAddPetugas}
        handleEditPetugas={handleEditPetugas}
        handleDeletePetugas={handleDeletePetugas}
      />
    </div>
  );
}