import { DashboardSidebar } from "@/components/dashboard/sidebar";

interface NavLink {
  readonly label: string;
  readonly href: string;
  readonly icon: string;
}

interface WebDashboardLayoutProps {
  children: React.ReactNode;
  navLinks: readonly NavLink[];
  role: string;
  userName: string;
  onLogout: () => void;
}

export default function WebDashboardLayout({ children, navLinks, role, userName, onLogout }: WebDashboardLayoutProps) {
  return (
    <div className="min-h-[100svh]">
      <DashboardSidebar
        navLinks={navLinks}
        role={role}
        userName={userName}
        onLogout={onLogout}
      />
      <main className="lg:pl-64 min-h-[100svh]">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
