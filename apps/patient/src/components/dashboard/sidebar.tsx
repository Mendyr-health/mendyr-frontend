'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@mendyr/shared-utils';
import { Heart, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NAV_ICONS } from '@/lib/nav-icons';

interface NavLink {
  readonly label: string;
  readonly href: string;
  readonly icon: string;
}

export function DashboardSidebar({
  navLinks,
  role,
  userName,
  onLogout,
}: {
  navLinks: readonly NavLink[];
  role: string;
  userName?: string;
  onLogout?: () => void;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getIcon = (iconName: string) => {
    const Icon = NAV_ICONS[iconName as keyof typeof NAV_ICONS];
    return Icon ? <Icon className="h-5 w-5" /> : null;
  };

  const isActive = (href: string) => {
    if (href === `/${role.toLowerCase().replace('_', '-')}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="border-border flex items-center gap-2 border-b px-6 py-5">
        <Image
          src="/mendyr.png"
          loading="eager"
          alt="Mendyr Logo"
          width={120}
          height={40}
          className="h-8 w-auto object-contain"
          style={{ width: 'auto' }}
        />
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              isActive(link.href)
                ? 'bg-primary/10 text-primary-light border-primary border'
                : 'text-muted-foreground hover:text-muted-foreground hover:bg-muted',
            )}
          >
            {getIcon(link.icon)}
            {link.label}
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-border border-t px-3 py-4">
        {userName && (
          <div className="mb-2 px-3 py-2">
            <p className="text-muted-foreground text-xs">Signed in as</p>
            <p className="text-muted-foreground truncate text-sm font-medium">{userName}</p>
          </div>
        )}
        <button
          onClick={onLogout}
          className="text-muted-foreground flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="bg-glass fixed top-4 left-4 z-50 cursor-pointer rounded-lg p-2 lg:hidden"
      >
        {mobileOpen ? (
          <X className="text-muted-foreground h-5 w-5" />
        ) : (
          <Menu className="text-muted-foreground h-5 w-5" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="bg-muted fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-sidebar border-border fixed top-0 left-0 z-40 h-screen w-64 border-r transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
