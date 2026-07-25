"use client";
import { usePlatform } from "@/hooks/usePlatform";
import dynamic from "next/dynamic";

const WebAdminDashboard = dynamic(() => import("@/components/web/admin/WebAdminDashboard"));
const MobileAdminDashboard = dynamic(() => import("@/components/mobile/admin/MobileAdminDashboard"));

export default function AdminDashboardPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobileAdminDashboard />;
  }

  return <WebAdminDashboard />;
}
