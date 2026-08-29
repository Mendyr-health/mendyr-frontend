"use client";
import { usePlatform } from "@mendyr/shared-utils";
import dynamic from "next/dynamic";

const WebPatientSettings = dynamic(() => import("@/components/web/patient/WebPatientSettings"));
const MobilePatientSettings = dynamic(() => import("@/components/mobile/patient/MobilePatientSettings"));

export default function PatientSettingsPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobilePatientSettings />;
  }

  return <WebPatientSettings />;
}
