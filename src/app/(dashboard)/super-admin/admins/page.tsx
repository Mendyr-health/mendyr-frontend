"use client";
import { usePlatform } from "@/hooks/usePlatform";
import dynamic from "next/dynamic";

const WebSuperAdminAdmins = dynamic(() => import("@/components/web/super-admin/admins/WebSuperAdminAdmins"));
const MobileSuperAdminAdmins = dynamic(() => import("@/components/mobile/super-admin/admins/MobileSuperAdminAdmins"));

export default function SuperAdminAdminsPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobileSuperAdminAdmins />;
  }

  return <WebSuperAdminAdmins />;
}
