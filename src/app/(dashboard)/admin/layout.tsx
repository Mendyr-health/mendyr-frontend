"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ADMIN_NAV_LINKS } from "@/lib/constants";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navLinks={ADMIN_NAV_LINKS} role="ADMIN">
      {children}
    </DashboardLayout>
  );
}
