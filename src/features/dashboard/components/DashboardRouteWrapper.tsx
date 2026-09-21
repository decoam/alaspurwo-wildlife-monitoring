"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";

type DashboardRouteWrapperProps = {
  user: {
    fullName: string;
    role: string;
    posPengamatan: string;
    avatarInitials: string;
  };
  children: ReactNode;
};

export function DashboardRouteWrapper({ user, children }: DashboardRouteWrapperProps) {
  const pathname = usePathname() ?? "";
  const isManagerRoute = pathname.startsWith("/dashboard/manajer");

  if (isManagerRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-surface-bg text-text-light">
      <DashboardSidebar user={user} />
      <div className="min-h-screen md:pl-[20rem]">
        <DashboardHeader user={user} />
        <main>{children}</main>
      </div>
    </div>
  );
}
