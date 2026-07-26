"use client";
import { usePlatform } from "@/hooks/usePlatform";
import dynamic from "next/dynamic";

const WebNurseMessages = dynamic(() => import("@/components/web/nurse/messages/WebNurseMessages"));

export default function NurseMessagesPage() {
  const { isMobile } = usePlatform();

  return <WebNurseMessages />;
}
