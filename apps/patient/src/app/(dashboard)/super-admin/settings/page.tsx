'use client';
import { usePlatform } from '@mendyr/shared-utils';
import dynamic from 'next/dynamic';

const WebSuperAdminSettings = dynamic(
  () => import('@/components/web/super-admin/settings/WebSuperAdminSettings'),
);
const MobileSuperAdminSettings = dynamic(
  () => import('@/components/mobile/super-admin/settings/MobileSuperAdminSettings'),
);

export default function SuperAdminSettingsPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobileSuperAdminSettings />;
  }

  return <WebSuperAdminSettings />;
}
