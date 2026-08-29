'use client';
import { usePlatform } from '@mendyr/shared-utils';
import dynamic from 'next/dynamic';

const WebPatientMessages = dynamic(() => import('@/components/web/patient/WebPatientMessages'));
const MobilePatientMessages = dynamic(
  () => import('@/components/mobile/patient/MobilePatientMessages'),
);

export default function PatientMessagesPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobilePatientMessages />;
  }

  return <WebPatientMessages />;
}
