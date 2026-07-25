"use client";
import { useAuth } from "@/hooks/use-auth";
import { ADMIN_NAV_LINKS, SUPER_ADMIN_NAV_LINKS, NURSE_NAV_LINKS, PATIENT_NAV_LINKS } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { usePlatform } from "@/hooks/usePlatform";
import dynamic from "next/dynamic";

// Dynamically load layouts so we don't send mobile layout code to web users and vice-versa
const WebDashboardLayout = dynamic(() => import("@/components/web/layout/WebDashboardLayout"));
const MobileDashboardLayout = dynamic(() => import("@/components/mobile/layout/MobileDashboardLayout"));

function getNavLinksForRole(role: string) {
  switch (role) {
    case "SUPER_ADMIN": return SUPER_ADMIN_NAV_LINKS;
    case "ADMIN": return ADMIN_NAV_LINKS;
    case "NURSE": return NURSE_NAV_LINKS;
    case "PATIENT": return PATIENT_NAV_LINKS;
    default: return [];
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const { isMobile } = usePlatform();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Determine role from pathname as fallback
  const roleFromPath = pathname.startsWith("/super-admin") ? "SUPER_ADMIN"
    : pathname.startsWith("/admin") ? "ADMIN"
    : pathname.startsWith("/nurse") ? "NURSE"
    : "PATIENT";

  const role = user?.role || roleFromPath;
  const navLinks = getNavLinksForRole(role);
  const userName = user?.fullName || "User";

  if (isMobile) {
    return (
      <MobileDashboardLayout 
        navLinks={navLinks} 
        role={role} 
        userName={userName} 
        onLogout={logout}
      >
        {children}
      </MobileDashboardLayout>
    );
  }

  return (
    <WebDashboardLayout 
      navLinks={navLinks} 
      role={role} 
      userName={userName} 
      onLogout={logout}
    >
      {children}
    </WebDashboardLayout>
  );
}
