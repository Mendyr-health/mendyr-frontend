'use client';
import dynamic from 'next/dynamic';

const WebNurseServices = dynamic(() => import('@/components/web/nurse/services/WebNurseServices'));

export default function NurseServicesPage() {
  return <WebNurseServices />;
}
