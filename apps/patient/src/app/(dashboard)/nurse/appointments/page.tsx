"use client";
import { usePlatform } from "@mendyr/shared-utils";
import dynamic from "next/dynamic";

const WebNurseAppointments = dynamic(() => import("@/components/web/nurse/appointments/WebNurseAppointments"));

export default function NurseAppointmentsPage() {
  const { isMobile } = usePlatform();

  // For now we render the responsive web component for both or extend mobile later
  return <WebNurseAppointments />;
}
