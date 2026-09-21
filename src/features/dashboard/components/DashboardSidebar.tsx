"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Camera, PlusCircle, UserCircle2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";


type DashboardSidebarProps = {
  user: {
    fullName: string;
    role: string;
    posPengamatan: string;
    avatarInitials: string;
  };
};

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: true },
  { label: "Data Pengamatan", href: "/dashboard/observations", icon: Camera, active: false },
  { label: "Tambah Pengamatan", href: "/dashboard/observations/create", icon: PlusCircle, active: false },
  { label: "Profil", href: "/dashboard/profile", icon: UserCircle2, active: false },
];

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const toggleSidebar = () => setIsOpen((open) => !open);
    window.addEventListener("dashboard-sidebar-toggle", toggleSidebar);
    return () => window.removeEventListener("dashboard-sidebar-toggle", toggleSidebar);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {isOpen && <button type="button" aria-label="Tutup navigasi dashboard" className="fixed inset-0 z-40 bg-surface-bg/70 md:hidden" onClick={() => setIsOpen(false)} />}
      <aside className={`fixed inset-y-4 left-4 z-50 flex w-[calc(100%-2rem)] max-w-72 flex-col justify-between rounded-[28px] border border-brand-primary/60 bg-surface-bg/95 p-5 shadow-2xl transition-transform duration-200 md:inset-y-6 md:left-8 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)] md:translate-x-0"}`}>
      <div>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-brand-hover to-lime-600 text-lg font-semibold text-text-heading">
            {user.avatarInitials}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-heading">{user.fullName || "Alas Purwo"}</p>
            <p className="text-xs text-brand-text-light/70">{user.role || "Wildlife Monitoring"}</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                  pathname === item.href
                    ? "bg-brand-primary/30 text-text-heading shadow-inner"
                    : "text-text-secondary hover:bg-brand-primary/50 hover:text-text-heading"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-2xl border border-amber-bg bg-amber-bg px-3 py-3 text-sm font-medium text-amber-text transition hover:bg-hover-bg"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
      </aside>
    </>
  );
}
