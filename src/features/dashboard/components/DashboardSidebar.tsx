"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="flex h-full w-full flex-col justify-between rounded-[28px] border border-emerald-900/60 bg-[#07110c]/90 p-5 shadow-2xl">
      <div>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-lime-600 text-lg font-semibold text-white">
            {user.avatarInitials}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{user.fullName || "Alas Purwo"}</p>
            <p className="text-xs text-emerald-200/70">{user.role || "Wildlife Monitoring"}</p>
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
                  item.active
                    ? "bg-emerald-700/30 text-white shadow-inner"
                    : "text-slate-300 hover:bg-emerald-900/50 hover:text-white"
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
        className="flex items-center gap-3 rounded-2xl border border-amber-900/40 bg-amber-950/30 px-3 py-3 text-sm font-medium text-amber-100 transition hover:bg-amber-900/40"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
