'use client';
import { usePlatform } from '@mendyr/shared-utils';
import dynamic from 'next/dynamic';

const WebPatientProfile = dynamic(() => import('@/components/web/patient/WebPatientProfile'));
const MobilePatientProfile = dynamic(
  () => import('@/components/mobile/patient/MobilePatientProfile'),
);

export default function PatientProfilePage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobilePatientProfile />;
  }

  return <WebPatientProfile />;
}
