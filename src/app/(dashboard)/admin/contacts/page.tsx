"use client";
import { usePlatform } from "@/hooks/usePlatform";
import dynamic from "next/dynamic";

const WebAdminContacts = dynamic(() => import("@/components/web/admin/contacts/WebAdminContacts"));
const MobileAdminContacts = dynamic(() => import("@/components/mobile/admin/contacts/MobileAdminContacts"));

export default function AdminContactsPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobileAdminContacts />;
  }

  return <WebAdminContacts />;
}
