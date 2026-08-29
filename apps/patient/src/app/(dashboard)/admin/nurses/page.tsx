'use client';
import { usePlatform } from '@mendyr/shared-utils';
import dynamic from 'next/dynamic';

const WebAdminNurses = dynamic(() => import('@/components/web/admin/nurses/WebAdminNurses'));
const MobileAdminNurses = dynamic(
  () => import('@/components/mobile/admin/nurses/MobileAdminNurses'),
);

export default function AdminNursesPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobileAdminNurses />;
  }

  return <WebAdminNurses />;
}
