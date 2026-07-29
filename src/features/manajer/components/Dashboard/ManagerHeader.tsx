"use client";

import React from "react";
import { BellRing } from "lucide-react";

type ManagerHeaderProps = {
  title?: string;
  subtitle?: string;
  user: {
    fullName: string;
    role: string;
    avatarInitials: string;
  };
};

export function ManagerHeader({ 
  title = "Dashboard Konservasi",
  subtitle = "Monitoring Center",
  user 
}: ManagerHeaderProps) {
  return (
    <header className="flex flex-row items-center justify-between gap-4 rounded-3xl md:rounded-[28px] border border-brand-primary/60 bg-surface-subtle/85 p-4 md:px-5 md:py-4 shadow-card">
      {/* Kiri: Judul Halaman Dinamis */}
      <div className="min-w-0 flex-1 sm:flex-initial">
        <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-brand-text">
          {subtitle}
        </p>
        <h1 className="mt-0.5 text-base md:text-2xl font-semibold text-text-heading truncate max-w-45 xs:max-w-[240px] sm:max-w-md">
          {title}
        </h1>
      </div>

      {/* Kanan: Notifikasi dan Profil */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Widget Info Login User */}
        {/* Perbaikan: Menggunakan 'p-1 sm:py-1.5 sm:pl-1.5 sm:pr-3' agar simetris di mobile */}
        <div className="flex items-center gap-2 md:gap-3 rounded-2xl border border-border-subtle bg-input-bg p-1 sm:py-1.5 sm:pl-1.5 sm:pr-3 md:py-2">
          {/* Avatar Bulat (Selalu Muncul & Pas di Tengah saat Mobile) */}
          <div className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-hover to-lime-600 text-xs md:text-sm font-semibold text-text-heading shadow-md">
            {user.avatarInitials}
          </div>
          
          {/* Teks Nama & Role (Hanya muncul di tablet/desktop) */}
          <div className="hidden sm:block min-w-0 max-w-30 md:max-w-45">
            <p className="text-xs md:text-sm font-semibold text-text-heading truncate">
              {user.fullName}
            </p>
            <p className="text-xs md:text-xs text-text-muted truncate">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}