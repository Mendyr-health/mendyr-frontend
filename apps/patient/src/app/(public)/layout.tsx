"use client";

import { usePathname } from "next/navigation";
import { PublicHeader, PublicFooter } from "@/components/layout/public-layout";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // The home screen is a minimal branded launch point (see
  // MinimalHome). Other public pages (services, about, contact) still get
  // the normal chrome, since they're useful there too.
  const isMinimalNativeHome = pathname === "/";

  if (isMinimalNativeHome) {
    return <>{children}</>;
  }

  return (
    <>
      <PublicHeader />
      <main className="min-h-[100svh]">{children}</main>
      <PublicFooter />
    </>
  );
}
