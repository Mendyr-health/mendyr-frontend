import { DashboardSidebar } from '@/components/dashboard/sidebar';

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

export default function WebDashboardLayout({
  children,
  navLinks,
  role,
  userName,
  onLogout,
}: WebDashboardLayoutProps) {
  return (
    <div className="min-h-[100svh]">
      <DashboardSidebar navLinks={navLinks} role={role} userName={userName} onLogout={onLogout} />
      <main className="min-h-[100svh] lg:pl-64">
        {/* pt-20 clears the sidebar's fixed mobile-toggle button (top-4 left-4, lg:hidden in
            DashboardSidebar) — below `lg` it overlaps page content otherwise, since a `fixed`
            element takes no space in flow. lg:p-8 restores normal padding once the toggle
            (and the padding meant to clear it) no longer applies. */}
        <div className="mx-auto max-w-7xl p-6 pt-20 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
