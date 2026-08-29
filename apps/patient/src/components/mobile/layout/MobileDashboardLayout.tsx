import { TopAppBar } from "./TopAppBar";
import { BottomNavigation } from "./BottomNavigation";

interface NavLink {
  readonly label: string;
  readonly href: string;
  readonly icon: string;
}

interface MobileDashboardLayoutProps {
  children: React.ReactNode;
  navLinks: readonly NavLink[];
  role: string;
  userName: string;
  onLogout: () => void;
}

export default function MobileDashboardLayout({ children, navLinks, role, userName, onLogout }: MobileDashboardLayoutProps) {
  return (
    <div className="min-h-[100svh] flex flex-col bg-background">
      <TopAppBar userName={userName} onLogout={onLogout} />
      
      {/* Scrollable Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 pt-16">
        <div className="p-4">
          {children}
        </div>
      </main>

      <BottomNavigation navLinks={navLinks} role={role} />
    </div>
  );
}
