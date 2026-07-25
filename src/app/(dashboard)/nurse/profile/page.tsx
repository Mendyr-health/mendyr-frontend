"use client";
import { usePlatform } from "@/hooks/usePlatform";
import dynamic from "next/dynamic";

const WebNurseProfile = dynamic(() => import("@/components/web/nurse/profile/WebNurseProfile"));
const MobileNurseProfile = dynamic(() => import("@/components/mobile/nurse/profile/MobileNurseProfile"));

export default function NurseProfilePage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobileNurseProfile />;
  }

  return <WebNurseProfile />;
}
