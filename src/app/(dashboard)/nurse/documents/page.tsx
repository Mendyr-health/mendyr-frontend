"use client";
import { usePlatform } from "@/hooks/usePlatform";
import dynamic from "next/dynamic";

const WebNurseDocuments = dynamic(() => import("@/components/web/nurse/documents/WebNurseDocuments"));
const MobileNurseDocuments = dynamic(() => import("@/components/mobile/nurse/documents/MobileNurseDocuments"));

export default function NurseDocumentsPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobileNurseDocuments />;
  }

  return <WebNurseDocuments />;
}
