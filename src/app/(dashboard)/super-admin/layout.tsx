"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SUPER_ADMIN_NAV_LINKS } from "@/lib/constants";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout navLinks={SUPER_ADMIN_NAV_LINKS} role="SUPER_ADMIN">
      {children}
    </DashboardLayout>
  );
}
