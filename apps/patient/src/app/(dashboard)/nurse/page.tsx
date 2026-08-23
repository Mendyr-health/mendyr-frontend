"use client";
import { usePlatform } from "@mendyr/shared-utils";
import dynamic from "next/dynamic";

const WebNurseDashboard = dynamic(() => import("@/components/web/nurse/WebNurseDashboard"));
const MobileNurseDashboard = dynamic(() => import("@/components/mobile/nurse/MobileNurseDashboard"));

export default function NurseDashboardPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobileNurseDashboard />;
  }

  return <WebNurseDashboard />;
}
