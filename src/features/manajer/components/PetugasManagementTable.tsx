"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Edit2, Trash2, X, Loader2, Search, Eye, EyeOff, User } from "lucide-react";

type UserType = {
  _id: string;
  fullName: string;
  username: string;
  role: string;
};

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
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // State Form Input
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // State untuk menentukan status visibility password
  const [showPassword, setShowPassword] = useState(false);

  // Filter data berdasarkan search query
  const filteredUsers = initialUsers.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pemicu Buka Modal
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
  };

  // Aksi Tambah Akun
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
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Aksi Edit Akun
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
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Aksi Hapus Akun
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
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-emerald-900/60 bg-[#0c1914]/85 p-4 sm:p-6 shadow-xl space-y-6">
      
      {/* BAGIAN ATAS CARD: Judul, Teks Keterangan, dan Tombol Tambah Petugas */}
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

        {/* Tombol Tambah Petugas */}
        <div className="shrink-0">
          <button
            onClick={openAddModal}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-emerald-500 hover:to-lime-500 shadow-md"
          >
            <UserPlus className="h-4 w-4" />
            Tambah Petugas
          </button>
        </div>
      </div>

      <hr className="border-emerald-900/40" />

      {/* BARIS KONTROL SEARCH INPUT */}
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

      {/* ================= TAMPILAN RESPONSIVE LAYER ================= */}

      {/* BENTUK CARD BERSUSUN (Mobile/HP) */}
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
              {/* Header Card: Hanya Nama & Username */}
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

                {/* Tombol Tindakan */}
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

      {/* BENTUK TABEL KLASIK & SEIMBANG (Tablet & Desktop - md ke atas) */}
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
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-slate-500">
                  {initialUsers.length === 0
                    ? "Belum ada data petugas lapangan terdaftar."
                    : "Tidak ada hasil pencarian yang sesuai."}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
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

      {/* ================= MODAL DIALOG POP-UP INTERAKTIF ================= */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[28px] border border-emerald-900/60 bg-[#0c1914] p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Tombol Close */}
            <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
              <X className="h-5 w-5" />
            </button>

            {/* Konten Sesuai Tipe Modal */}
            {modalType === "delete" ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Konfirmasi Hapus Akun</h3>
                <p className="text-sm text-slate-400">
                  Apakah Anda yakin ingin menghapus akun petugas <strong className="text-emerald-400">@{selectedUser?.username}</strong>? Aktivitas terkait petugas ini tidak akan terhapus, tetapi akun ini tidak bisa masuk lagi ke sistem.
                </p>
                {errorMsg && <div className="text-sm bg-red-950/40 text-red-400 p-3 rounded-xl border border-red-900/60">{errorMsg}</div>}
                {successMsg && <div className="text-sm bg-emerald-950/40 text-emerald-400 p-3 rounded-xl border border-emerald-900/60">{successMsg}</div>}
                
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={closeModal} className="px-4 py-2 rounded-xl border border-emerald-900/60 bg-[#10241a] text-sm text-slate-300 hover:bg-emerald-900/40 transition">Batal</button>
                  <button onClick={handleDeletePetugas} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-500 transition disabled:opacity-50">
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} Hapus Akun
                  </button>
                </div>
              </div>
            ) : (
              // FORM UNTUK ADD / EDIT PETUGAS
              <form onSubmit={modalType === "add" ? handleAddPetugas : handleEditPetugas} className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  {modalType === "add" ? "Tambah Akun Petugas Baru" : "Edit Akun Petugas"}
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#10241a] border border-emerald-900/60 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                    placeholder="Contoh: Ahmad Subari"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#10241a] border border-emerald-900/60 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                    placeholder="Contoh: subari24"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Password {modalType === "edit" && <span className="text-[10px] text-slate-500 lowercase">(kosongkan jika tidak diubah)</span>}
                  </label>
                  
                  {/* Pembungkus Input Password */}
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? "text" : "password"}
                      required={modalType === "add"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#10241a] border border-emerald-900/60 rounded-xl pl-3 pr-10 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                      placeholder={modalType === "add" ? "••••••••" : "Masukkan password baru"}
                    />
                    
                    {/* Tombol Ikon Mata Interaktif */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-emerald-400 transition"
                      title={showPassword ? "Sembunyikan Password" : "Tampilkan Password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {errorMsg && <div className="text-sm bg-red-950/40 text-red-400 p-3 rounded-xl border border-red-900/60">{errorMsg}</div>}
                {successMsg && <div className="text-sm bg-emerald-950/40 text-emerald-400 p-3 rounded-xl border border-emerald-900/60">{successMsg}</div>}

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl border border-emerald-900/60 bg-[#10241a] text-sm text-slate-300 hover:bg-emerald-900/40 transition">Batal</button>
                  <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-lime-600 text-sm font-semibold text-white hover:from-emerald-500 hover:to-lime-500 transition disabled:opacity-50">
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {modalType === "add" ? "Simpan Akun" : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}