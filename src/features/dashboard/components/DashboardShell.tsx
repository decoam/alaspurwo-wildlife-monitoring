"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { DashboardSidebar } from "./DashboardSidebar";

type ShellUser = {
  fullName: string;
  role: string;
  posPengamatan: string;
  avatarInitials: string;
};

type DashboardShellProps = {
  user: ShellUser;
  children: React.ReactNode;
};

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const close = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#07110c] text-slate-100">

      {/* ── Mobile top bar (hidden on md+) ───────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 border-b border-emerald-900/60 bg-[#07110c]/95 px-4 backdrop-blur-sm md:hidden">
        <button
          type="button"
          aria-label="Buka menu"
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl border border-emerald-900/60 p-2 text-emerald-300 transition hover:bg-emerald-900/40"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-white">Alas Purwo WMS</span>
      </div>

      {/* ── Mobile overlay (click to close) ──────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      {/*
       * Desktop (md+):  always visible, fixed left, full height.
       * Mobile (<md):   hidden by default (-translate-x-full), slides in
       *                 (translate-x-0) when sidebarOpen = true.
       */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 w-72 transition-transform duration-300 ease-in-out",
          "md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Inner padding so the sidebar card sits inside the fixed panel */}
        <div className="flex h-full flex-col p-3">
          <DashboardSidebar user={user} onClose={close} />
        </div>
      </aside>

      {/* ── Main content area ─────────────────────────────────────────────── */}
      {/*
       * md:pl-72 — offset by sidebar width on desktop so content never slides
       *            under the fixed sidebar.
       * pt-14    — clear the mobile top bar height.
       * md:pt-0  — no top bar on desktop.
       * Each child page owns its own inner padding via its CSS utility classes.
       */}
      <div className="md:pl-72 pt-14 md:pt-0 min-h-screen">
        {children}
      </div>

    </div>
  );
}
