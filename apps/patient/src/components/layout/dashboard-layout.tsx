"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, UserCheck, Users, Stethoscope, ClipboardList, Mail,
  Shield, Key, Lock, FileText, Settings, ChevronLeft, ChevronRight,
  LogOut, Search, Bell, Menu, User, CheckCircle, Calendar, MoreHorizontal, X
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, UserCheck, Users, Stethoscope, ClipboardList, Mail,
  Shield, Key, Lock, FileText, Settings, User, CheckCircle, Calendar
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
    router.push("/login");
  };

  // Determine bottom nav items (max 4 slots on mobile)
  let bottomNavLinks = navLinks.slice(0, 4);
  let moreLinks: readonly SidebarLink[] = [];
  if (navLinks.length > 4) {
    bottomNavLinks = navLinks.slice(0, 3);
    moreLinks = navLinks.slice(3);
  }

  const DesktopSidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center gap-3 border-b border-border">
        <Image src="/mendyr.png" loading="eager" alt="Mendyr Logo" width={120} height={40} className={`h-8 object-contain ${collapsed ? "w-8" : "w-auto"}`} style={collapsed ? { height: "auto" } : { width: "auto" }} />
      </div>

      {!collapsed && (
        <div className="px-4 py-3">
          <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
            {role.replace("_", " ")}
          </span>
        </div>
      )}

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const Icon = iconMap[link.icon] || LayoutDashboard;
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop & Tablet Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-sidebar border-r border-border transition-all duration-300 relative ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {DesktopSidebar}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-6 -right-3 w-6 h-6 rounded-full bg-sidebar border border-border flex items-center justify-center text-muted-foreground hover:text-foreground z-50 shadow-sm"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden pb-[70px] md:pb-0">
        
        {/* Top Header */}
        <header className="h-14 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0 z-20">
          <div className="flex items-center gap-4">
            {/* Mobile Logo replacing hamburger */}
            <div className="md:hidden">
              <Image src="/mendyr.png" alt="Mendyr" width={100} height={32} className="h-7 object-contain" />
            </div>
            
            {/* Desktop Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-1.5 rounded-full bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-64 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-muted-foreground hover:text-foreground bg-muted/30 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-background" />
            </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/10">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[70px] bg-background/90 backdrop-blur-xl border-t border-border flex items-center justify-around px-2 pb-safe z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {bottomNavLinks.map((link) => {
          const Icon = iconMap[link.icon] || LayoutDashboard;
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setDrawerOpen(false)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <motion.div whileTap={{ scale: 0.9 }}>
                <Icon className={`w-6 h-6 ${isActive ? "fill-primary/20" : ""}`} />
              </motion.div>
              <span className="text-[10px] font-medium tracking-wide">{link.label}</span>
            </Link>
          );
        })}

        {moreLinks.length > 0 && (
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
              drawerOpen ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <motion.div whileTap={{ scale: 0.9 }}>
              <Menu className="w-6 h-6" />
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-2xl z-50 md:hidden max-h-[85vh] flex flex-col"
            >
              <div className="flex justify-center p-3 shrink-0">
                <div className="w-12 h-1.5 bg-border rounded-full" />
              </div>
              
              <div className="px-6 pb-2 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <p className="text-xs text-muted-foreground">{role.replace("_", " ")}</p>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="p-2 bg-muted/50 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="overflow-y-auto px-4 pb-8 space-y-2">
                {moreLinks.map((link) => {
                  const Icon = iconMap[link.icon] || LayoutDashboard;
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "bg-muted/30 text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  );
                })}
                
                <div className="h-px bg-border my-4 mx-2" />
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 px-4 py-3 rounded-2xl w-full text-left text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut className="w-5 h-5 shrink-0" />
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
