'use client';
import { usePlatform } from '@mendyr/shared-utils';
import dynamic from 'next/dynamic';

const WebAdminWaitlist = dynamic(() => import('@/components/web/admin/waitlist/WebAdminWaitlist'));
const MobileAdminWaitlist = dynamic(
  () => import('@/components/mobile/admin/waitlist/MobileAdminWaitlist'),
);

export default function AdminWaitlistPage() {
  const { isMobile } = usePlatform();

  if (isMobile) {
    return <MobileAdminWaitlist />;
  }

  return <WebAdminWaitlist />;
}
