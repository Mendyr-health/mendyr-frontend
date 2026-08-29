"use client";
import { usePlatform } from "@mendyr/shared-utils";
import dynamic from "next/dynamic";

const WebNurseMessages = dynamic(() => import("@/components/web/nurse/messages/WebNurseMessages"));

export default function NurseMessagesPage() {
  const { isMobile } = usePlatform();

  return <WebNurseMessages />;
}
