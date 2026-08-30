'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePlatform } from '@mendyr/shared-utils';
import { MinimalHome } from '@/components/mobile/public/MinimalHome';

export default function HomePage() {
  const router = useRouter();
  const { isCapacitor } = usePlatform();

  useEffect(() => {
    if (isCapacitor) {
      router.replace('/login');
    }
  }, [isCapacitor, router]);

  if (isCapacitor) return null;

  return <MinimalHome />;
}
