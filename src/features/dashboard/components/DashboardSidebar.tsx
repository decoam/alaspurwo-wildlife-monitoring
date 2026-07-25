"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Camera, PlusCircle, UserCircle2, LogOut, X } from "lucide-react";
import { signOut } from "next-auth/react";

type DashboardSidebarProps = {
  user: {
    fullName: string;
    role: string;
    posPengamatan: string;
    avatarInitials: string;
  };
  onClose?: () => void;
};

const menuItems = [
  { label: "Dashboard",          href: "/dashboard",                     icon: LayoutDashboard, exact: true  },
  { label: "Data Pengamatan",    href: "/dashboard/observations",        icon: Camera,          exact: false },
  { label: "Tambah Pengamatan",  href: "/dashboard/observations/create", icon: PlusCircle,      exact: false },
  { label: "Profil",             href: "/dashboard/profile",             icon: UserCircle2,     exact: false },
];

export function DashboardSidebar({ user, onClose }: DashboardSidebarProps) {
  const router   = useRouter();
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="flex h-full w-full flex-col justify-between rounded-[28px] border border-emerald-900/60 bg-[#07110c]/90 p-5 shadow-2xl">
      <div>
        {/* Header row: avatar + user info + X close (mobile only) */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-lime-600 text-lg font-semibold text-white">
            {user.avatarInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user.fullName || "Alas Purwo"}</p>
            <p className="truncate text-xs text-emerald-200/70">{user.role || "Wildlife Monitoring"}</p>
          </div>
          {/* X button — only visible on mobile, closes the drawer */}
          {onClose && (
            <button
              type="button"
              aria-label="Tutup menu"
              onClick={onClose}
              className="md:hidden ml-auto shrink-0 rounded-xl border border-emerald-900/60 p-1.5 text-slate-400 transition hover:bg-emerald-900/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation links */}
        <nav className="space-y-2">
          {menuItems.map(({ label, href, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={label}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-emerald-700/30 text-white shadow-inner"
                    : "text-slate-300 hover:bg-emerald-900/50 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-2xl border border-amber-900/40 bg-amber-950/30 px-3 py-3 text-sm font-medium text-amber-100 transition hover:bg-amber-900/40"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
