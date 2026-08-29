'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  Stethoscope,
  ClipboardList,
  Mail,
  Shield,
  Key,
  Lock,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Search,
  Bell,
  Menu,
  User,
  CheckCircle,
  Calendar,
  MoreHorizontal,
  X,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  UserCheck,
  Users,
  Stethoscope,
  ClipboardList,
  Mail,
  Shield,
  Key,
  Lock,
  FileText,
  Settings,
  User,
  CheckCircle,
  Calendar,
};

interface SidebarLink {
  label: string;
  href: string;
  icon: string;
}

export function DashboardLayout({
  children,
  navLinks,
  role,
}: {
  children: React.ReactNode;
  navLinks: readonly SidebarLink[];
  role: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    // Perform any client-side logout cleanup here
    router.push('/login');
  };

  // Determine bottom nav items (max 4 slots on mobile)
  let bottomNavLinks = navLinks.slice(0, 4);
  let moreLinks: readonly SidebarLink[] = [];
  if (navLinks.length > 4) {
    bottomNavLinks = navLinks.slice(0, 3);
    moreLinks = navLinks.slice(3);
  }

  const DesktopSidebar = (
    <div className="flex h-full flex-col">
      <div className="border-border flex items-center gap-3 border-b p-4">
        <Image
          src="/mendyr.png"
          loading="eager"
          alt="Mendyr Logo"
          width={120}
          height={40}
          className={`h-8 object-contain ${collapsed ? 'w-8' : 'w-auto'}`}
          style={collapsed ? { height: 'auto' } : { width: 'auto' }}
        />
      </div>

      {!collapsed && (
        <div className="px-4 py-3">
          <span className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs font-medium">
            {role.replace('_', ' ')}
          </span>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navLinks.map((link) => {
          const Icon = iconMap[link.icon] || LayoutDashboard;
          const isActive =
            pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/'));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-border border-t p-3">
        <button
          onClick={handleLogout}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* Desktop & Tablet Sidebar */}
      <aside
        className={`bg-sidebar border-border relative hidden flex-col border-r transition-all duration-300 md:flex ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {DesktopSidebar}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-sidebar border-border text-muted-foreground hover:text-foreground absolute top-6 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border shadow-sm"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden pb-[70px] md:pb-0">
        {/* Top Header */}
        <header className="border-border bg-background/80 z-20 flex h-14 shrink-0 items-center justify-between border-b px-4 backdrop-blur-md">
          <div className="flex items-center gap-4">
            {/* Mobile Logo replacing hamburger */}
            <div className="md:hidden">
              <Image
                src="/mendyr.png"
                alt="Mendyr"
                width={100}
                height={32}
                className="h-7 object-contain"
              />
            </div>

            {/* Desktop Search */}
            <div className="relative hidden md:block">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-64 rounded-full border py-1.5 pr-4 pl-9 text-sm transition-all focus:ring-1 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-muted-foreground hover:text-foreground bg-muted/30 relative rounded-full p-2">
              <Bell className="h-5 w-5" />
              <span className="bg-primary border-background absolute top-1.5 right-1.5 h-2 w-2 rounded-full border-2" />
            </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="bg-muted/10 flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="bg-background/90 border-border pb-safe fixed right-0 bottom-0 left-0 z-40 flex h-[70px] items-center justify-around border-t px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl md:hidden">
        {bottomNavLinks.map((link) => {
          const Icon = iconMap[link.icon] || LayoutDashboard;
          const isActive =
            pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/'));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setDrawerOpen(false)}
              className={`flex h-full w-full flex-col items-center justify-center gap-1 transition-all ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <motion.div whileTap={{ scale: 0.9 }}>
                <Icon className={`h-6 w-6 ${isActive ? 'fill-primary/20' : ''}`} />
              </motion.div>
              <span className="text-[10px] font-medium tracking-wide">{link.label}</span>
            </Link>
          );
        })}

        {moreLinks.length > 0 && (
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex h-full w-full flex-col items-center justify-center gap-1 transition-all ${
              drawerOpen ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <motion.div whileTap={{ scale: 0.9 }}>
              <Menu className="h-6 w-6" />
            </motion.div>
            <span className="text-[10px] font-medium tracking-wide">Menu</span>
          </button>
        )}
      </nav>

      {/* Mobile Bottom Sheet Drawer for "Menu" */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-background fixed right-0 bottom-0 left-0 z-50 flex max-h-[85vh] flex-col rounded-t-3xl shadow-2xl md:hidden"
            >
              <div className="flex shrink-0 justify-center p-3">
                <div className="bg-border h-1.5 w-12 rounded-full" />
              </div>

              <div className="flex shrink-0 items-center justify-between px-6 pb-2">
                <div>
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <p className="text-muted-foreground text-xs">{role.replace('_', ' ')}</p>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="bg-muted/50 rounded-full p-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2 overflow-y-auto px-4 pb-8">
                {moreLinks.map((link) => {
                  const Icon = iconMap[link.icon] || LayoutDashboard;
                  const isActive =
                    pathname === link.href ||
                    (link.href !== '/' && pathname.startsWith(link.href + '/'));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-primary/20 shadow-md'
                          : 'bg-muted/30 text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  );
                })}

                <div className="bg-border mx-2 my-4 h-px" />

                <button
                  onClick={handleLogout}
                  className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left transition-all"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
