import type { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardRouteWrapper } from "@/features/dashboard/components/DashboardRouteWrapper";

export const runtime = "nodejs";

function getAvatarInitials(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "AP";
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const fullName = session.user?.fullName || session.user?.username || "Alas Purwo";
  const role = session.user?.role || "Petugas";
  const posPengamatan = (session.user as { posPengamatan?: string })?.posPengamatan || "Pos Pengamatan Utama";
  const user = {
    fullName,
    role,
    posPengamatan,
    avatarInitials: getAvatarInitials(fullName),
  };

  return <DashboardRouteWrapper user={user}>{children}</DashboardRouteWrapper>;
}
