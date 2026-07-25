"use client";
import { usePlatform } from "@/hooks/usePlatform";
import dynamic from "next/dynamic";

const WebNurseAvailability = dynamic(() => import("@/components/web/nurse/availability/WebNurseAvailability"));
const MobileNurseAvailability = dynamic(() => import("@/components/mobile/nurse/availability/MobileNurseAvailability"));

export default function NurseAvailabilityPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobileNurseAvailability />;
  }

  return <WebNurseAvailability />;
}
