"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@mendyr/shared-utils";
import { Heart, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import * as LucideIcons from "lucide-react";

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
    const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
    return Icon ? <Icon className="h-5 w-5" /> : null;
  };

  const isActive = (href: string) => {
    if (href === `/${role.toLowerCase().replace("_", "-")}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <Image src="/mendyr.png" loading="eager" alt="Mendyr Logo" width={120} height={40} className="h-8 w-auto object-contain" style={{ width: "auto" }} />
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive(link.href)
                ? "bg-primary/10 text-primary-light border border-primary"
                : "text-muted-foreground hover:text-muted-foreground hover:bg-muted"
            )}
          >
            {getIcon(link.icon)}
            {link.label}
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-border px-3 py-4">
        {userName && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="text-sm text-muted-foreground font-medium truncate">
              {userName}
            </p>
          </div>
        )}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full cursor-pointer"
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
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-glass cursor-pointer"
      >
        {mobileOpen ? (
          <X className="h-5 w-5 text-muted-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-muted z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-sidebar border-r border-border transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
