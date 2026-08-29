'use client';
import { usePlatform } from '@mendyr/shared-utils';
import dynamic from 'next/dynamic';

const WebAdminPatients = dynamic(() => import('@/components/web/admin/patients/WebAdminPatients'));
const MobileAdminPatients = dynamic(
  () => import('@/components/mobile/admin/patients/MobileAdminPatients'),
);

export default function AdminPatientsPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobileAdminPatients />;
  }

  return <WebAdminPatients />;
}
