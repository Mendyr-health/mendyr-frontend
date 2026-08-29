"use client";

import { usePathname } from "next/navigation";
import { PublicHeader, PublicFooter } from "@/components/layout/public-layout";
import { usePlatform } from "@/hooks/usePlatform";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isCapacitor } = usePlatform();
  // The native app's home screen is a minimal branded launch point (see
  // MinimalHome) — the marketing header/footer chrome would defeat the
  // point of it. Other public pages (services, about, contact) still get
  // the normal chrome even inside the app, since they're useful there too.
  const isMinimalNativeHome = isCapacitor && pathname === "/";

  if (isMinimalNativeHome) {
    return <>{children}</>;
  }

  return (
    <>
      <PublicHeader />
      <main className="min-h-screen">{children}</main>
      <PublicFooter />
    </>
  );
}
