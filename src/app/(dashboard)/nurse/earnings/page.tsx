"use client";
import { usePlatform } from "@/hooks/usePlatform";
import dynamic from "next/dynamic";

const WebNurseEarnings = dynamic(() => import("@/components/web/nurse/earnings/WebNurseEarnings"));

export default function NurseEarningsPage() {
  const { isMobile } = usePlatform();

  return <WebNurseEarnings />;
}
