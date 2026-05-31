"use client";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { ADMIN_NAV_LINKS, SUPER_ADMIN_NAV_LINKS, NURSE_NAV_LINKS, PATIENT_NAV_LINKS } from "@/lib/constants";
import { usePathname } from "next/navigation";

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

  return (
    <div className="min-h-screen">
      <DashboardSidebar
        navLinks={navLinks}
        role={role}
        userName={user?.fullName || "User"}
        onLogout={logout}
      />
      <main className="lg:pl-64 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
