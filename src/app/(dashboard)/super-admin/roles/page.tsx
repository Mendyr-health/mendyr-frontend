"use client";
import { usePlatform } from "@/hooks/usePlatform";
import dynamic from "next/dynamic";

const WebSuperAdminRoles = dynamic(() => import("@/components/web/super-admin/roles/WebSuperAdminRoles"));
const MobileSuperAdminRoles = dynamic(() => import("@/components/mobile/super-admin/roles/MobileSuperAdminRoles"));

export default function SuperAdminRolesPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobileSuperAdminRoles />;
  }

  return <WebSuperAdminRoles />;
}
