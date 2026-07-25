"use client";
import { usePlatform } from "@/hooks/usePlatform";
import dynamic from "next/dynamic";

const WebNurseStatus = dynamic(() => import("@/components/web/nurse/status/WebNurseStatus"));
const MobileNurseStatus = dynamic(() => import("@/components/mobile/nurse/status/MobileNurseStatus"));

export default function NurseStatusPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobileNurseStatus />;
  }

  return <WebNurseStatus />;
}
