"use client";

import { Menu } from "lucide-react";

type DashboardHeaderProps = {
  searchValue: string;
  user: {
    fullName: string;
    role: string;
    posPengamatan: string;
    avatarInitials: string;
  };
};

export function DashboardHeader({ searchValue, user }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-3x1 border border-brand-primary/60 bg-surface-subtle/85 px-5 py-4 shadow-card md:flex-row md:items-center md:justify-between">
      <div>
        <button
          type="button"
          aria-label="Buka navigasi dashboard"
          className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-primary/60 bg-input-bg text-text-heading md:hidden"
          onClick={() => window.dispatchEvent(new Event("dashboard-sidebar-toggle"))}
        >
          <Menu className="h-5 w-5" />
        </button>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-text">
          Monitoring Center
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-text-heading">Dashboard Konservasi</h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
       

        <div className="flex items-center gap-3">
         
          <div className="flex items-center gap-3 rounded-2xl border border-brand-primary/60 bg-input-bg px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-brand-hover to-lime-600 font-semibold text-text-heading">
              {user.avatarInitials}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-heading">{user.fullName || user.role}</p>
              <p className="text-xs text-text-muted">{user.posPengamatan || "Pos Pengamatan Utama"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
