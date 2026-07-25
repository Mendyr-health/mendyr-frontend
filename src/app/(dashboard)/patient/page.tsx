"use client";
import { usePlatform } from "@/hooks/usePlatform";
import dynamic from "next/dynamic";

const WebPatientDashboard = dynamic(() => import("@/components/web/patient/WebPatientDashboard"));
const MobilePatientDashboard = dynamic(() => import("@/components/mobile/patient/MobilePatientDashboard"));

export default function PatientDashboardPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobilePatientDashboard />;
  }

  return <WebPatientDashboard />;
}
