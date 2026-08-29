'use client';
import { usePlatform } from '@mendyr/shared-utils';
import dynamic from 'next/dynamic';

const WebNurseEarnings = dynamic(() => import('@/components/web/nurse/earnings/WebNurseEarnings'));

export default function NurseEarningsPage() {
  const { isMobile } = usePlatform();

  return <WebNurseEarnings />;
}
