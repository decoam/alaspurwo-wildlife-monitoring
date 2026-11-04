import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardShell } from "@/features/dashboard/components/DashboardShell";

export const runtime = "nodejs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { fullName, role, posPengamatan } = session.user;

  const avatarInitials = (fullName ?? "AP")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const user = {
    fullName: fullName ?? "",
    role: role ?? "Petugas",
    posPengamatan: posPengamatan ?? "",
    avatarInitials,
  };

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
