'use client';
import { usePlatform } from '@mendyr/shared-utils';
import dynamic from 'next/dynamic';

const WebSuperAdminDashboard = dynamic(
  () => import('@/components/web/super-admin/WebSuperAdminDashboard'),
);
const MobileSuperAdminDashboard = dynamic(
  () => import('@/components/mobile/super-admin/MobileSuperAdminDashboard'),
);

export default function SuperAdminDashboardPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobileSuperAdminDashboard />;
  }

  return <WebSuperAdminDashboard />;
}
