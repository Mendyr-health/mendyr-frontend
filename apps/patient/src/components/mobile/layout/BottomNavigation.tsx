"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@mendyr/shared-utils";
import * as LucideIcons from "lucide-react";

interface NavLink {
  readonly label: string;
  readonly href: string;
  readonly icon: string;
}

interface BottomNavigationProps {
  navLinks: readonly NavLink[];
  role: string;
}

export function BottomNavigation({ navLinks, role }: BottomNavigationProps) {
  const pathname = usePathname();

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
    return Icon ? <Icon className="h-6 w-6" /> : null;
  };

  const isActive = (href: string) => {
    if (href === `/${role.toLowerCase().replace("_", "-")}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // On mobile, space is limited, so we might want to slice to max 4-5 links.
  const displayLinks = navLinks.slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border px-2 pb-safe pt-2">
      <div className="flex justify-around items-center h-14">
        {displayLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {getIcon(link.icon)}
              <span className="text-[10px] font-medium leading-none">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
