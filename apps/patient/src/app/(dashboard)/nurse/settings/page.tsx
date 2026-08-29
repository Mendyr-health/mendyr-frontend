'use client';
import { usePlatform } from '@mendyr/shared-utils';
import dynamic from 'next/dynamic';

const WebNurseSettings = dynamic(() => import('@/components/web/nurse/settings/WebNurseSettings'));
const MobileNurseSettings = dynamic(
  () => import('@/components/mobile/nurse/settings/MobileNurseSettings'),
);

export default function NurseSettingsPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobileNurseSettings />;
  }

  return <WebNurseSettings />;
}
