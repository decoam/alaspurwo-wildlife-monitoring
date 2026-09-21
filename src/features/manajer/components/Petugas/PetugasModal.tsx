"use client";

import React from "react";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
      <div className="w-full max-w-md rounded-[28px] border border-brand-primary/60 bg-surface-subtle p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={closeModal} className="absolute top-4 right-4 text-text-muted hover:text-text-heading transition">
          <X className="h-5 w-5" />
        </button>

        {modalType === "delete" ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-heading">Konfirmasi Hapus Akun</h3>
            <p className="text-sm text-text-muted">
              Apakah Anda yakin ingin menghapus akun petugas <strong className="text-brand-text">@{selectedUser?.username}</strong>?
            </p>
            {errorMsg && <div className="text-sm bg-error-bg text-error-text p-3 rounded-xl border border-error-bg">{errorMsg}</div>}
            {successMsg && <div className="text-sm bg-brand-primary/40 text-brand-text p-3 rounded-xl border border-brand-primary/60">{successMsg}</div>}
            
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" type="button" onClick={closeModal}>
                Batal
              </Button>
              <Button type="button" variant="danger" onClick={handleDeletePetugas} disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} Hapus Akun
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={modalType === "add" ? handleAddPetugas : handleEditPetugas} className="space-y-4">
            <h3 className="text-lg font-semibold text-text-heading">
              {modalType === "add" ? "Tambah Akun Petugas Baru" : "Edit Akun Petugas"}
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-brand-text uppercase tracking-wider">Nama Lengkap</label>
              <Input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Ahmad Subari"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-brand-text uppercase tracking-wider">Username</label>
              <Input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: subari24"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-brand-text uppercase tracking-wider">
                Password {modalType === "edit" && <span className="text-xs text-text-muted lowercase">(kosongkan jika tidak diubah)</span>}
              </label>
              
              <div className="relative flex items-center">
                <Input
                  type={showPassword ? "text" : "password"}
                  required={modalType === "add"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  placeholder={modalType === "add" ? "••••••••" : "Masukkan password baru"}
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-text-muted hover:text-brand-text transition"
                  title={showPassword ? "Sembunyikan Password" : "Tampilkan Password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {errorMsg && <div className="text-sm bg-error-bg text-error-text p-3 rounded-xl border border-error-bg">{errorMsg}</div>}
            {successMsg && <div className="text-sm bg-brand-primary/40 text-brand-text p-3 rounded-xl border border-brand-primary/60">{successMsg}</div>}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={closeModal}>
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {modalType === "add" ? "Simpan Akun" : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
