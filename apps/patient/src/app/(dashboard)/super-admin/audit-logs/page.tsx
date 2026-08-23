"use client";
import { usePlatform } from "@mendyr/shared-utils";
import dynamic from "next/dynamic";

const WebSuperAdminAuditLogs = dynamic(() => import("@/components/web/super-admin/audit-logs/WebSuperAdminAuditLogs"));
const MobileSuperAdminAuditLogs = dynamic(() => import("@/components/mobile/super-admin/audit-logs/MobileSuperAdminAuditLogs"));

export default function SuperAdminAuditLogsPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobileSuperAdminAuditLogs />;
  }

  return <WebSuperAdminAuditLogs />;
}
