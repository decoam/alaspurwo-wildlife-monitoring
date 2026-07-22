"use client";

import React from "react";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import { UserType, ModalType } from "./PetugasManagementTable";

interface PetugasModalProps {
  modalType: ModalType;
  selectedUser: UserType | null;
  fullName: string;
  setFullName: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  errorMsg: string | null;
  successMsg: string | null;
  isLoading: boolean;
  closeModal: () => void;
  handleAddPetugas: (e: React.FormEvent) => void;
  handleEditPetugas: (e: React.FormEvent) => void;
  handleDeletePetugas: () => void;
}

export function PetugasModal({
  modalType,
  selectedUser,
  fullName,
  setFullName,
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  errorMsg,
  successMsg,
  isLoading,
  closeModal,
  handleAddPetugas,
  handleEditPetugas,
  handleDeletePetugas,
}: PetugasModalProps) {
  if (!modalType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-[28px] border border-emerald-900/60 bg-[#0c1914] p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white transition">
          <X className="h-5 w-5" />
        </button>

        {modalType === "delete" ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Konfirmasi Hapus Akun</h3>
            <p className="text-sm text-slate-400">
              Apakah Anda yakin ingin menghapus akun petugas <strong className="text-emerald-400">@{selectedUser?.username}</strong>?
            </p>
            {errorMsg && <div className="text-sm bg-red-950/40 text-red-400 p-3 rounded-xl border border-red-900/60">{errorMsg}</div>}
            {successMsg && <div className="text-sm bg-emerald-950/40 text-emerald-400 p-3 rounded-xl border border-emerald-900/60">{successMsg}</div>}
            
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={closeModal} className="px-4 py-2 rounded-xl border border-emerald-900/60 bg-[#10241a] text-sm text-slate-300 hover:bg-emerald-900/40 transition">
                Batal
              </button>
              <button onClick={handleDeletePetugas} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-500 transition disabled:opacity-50">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} Hapus Akun
              </button>
            </div>
          </div>
        ) : (
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
              
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required={modalType === "add"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#10241a] border border-emerald-900/60 rounded-xl pl-3 pr-10 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                  placeholder={modalType === "add" ? "••••••••" : "Masukkan password baru"}
                />
                
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
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl border border-emerald-900/60 bg-[#10241a] text-sm text-slate-300 hover:bg-emerald-900/40 transition">
                Batal
              </button>
              <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-emerald-600 to-lime-600 text-sm font-semibold text-white hover:from-emerald-500 hover:to-lime-500 transition disabled:opacity-50">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {modalType === "add" ? "Simpan Akun" : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}