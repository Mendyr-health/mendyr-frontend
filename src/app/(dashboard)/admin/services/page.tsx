"use client";
import { usePlatform } from "@/hooks/usePlatform";
import dynamic from "next/dynamic";

const WebAdminServices = dynamic(() => import("@/components/web/admin/services/WebAdminServices"));
const MobileAdminServices = dynamic(() => import("@/components/mobile/admin/services/MobileAdminServices"));

export default function AdminServicesPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobileAdminServices />;
  }

  return <WebAdminServices />;
}
