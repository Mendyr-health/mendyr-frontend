'use client';
import { usePlatform } from '@mendyr/shared-utils';
import dynamic from 'next/dynamic';

const WebPatientAppointments = dynamic(
  () => import('@/components/web/patient/WebPatientAppointments'),
);
const MobilePatientAppointments = dynamic(
  () => import('@/components/mobile/patient/MobilePatientAppointments'),
);

export default function PatientAppointmentsPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobilePatientAppointments />;
  }

  return <WebPatientAppointments />;
}
