'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@mendyr/shared-utils';
import { NAV_ICONS } from '@/lib/nav-icons';
import { hapticTap } from '@/lib/haptics';

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
    const Icon = NAV_ICONS[iconName as keyof typeof NAV_ICONS];
    return Icon ? <Icon className="h-6 w-6" /> : null;
  };

  const isActive = (href: string) => {
    if (href === `/${role.toLowerCase().replace('_', '-')}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // On mobile, space is limited, so we might want to slice to max 4-5 links.
  const displayLinks = navLinks.slice(0, 5);

  return (
    <nav className="bg-background border-border pb-safe fixed right-0 bottom-0 left-0 z-50 border-t px-2 pt-2">
      <div className="flex h-14 items-center justify-around">
        {displayLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => hapticTap()}
              className={cn(
                'flex h-full w-full flex-col items-center justify-center space-y-1 transition-colors',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {getIcon(link.icon)}
              <span className="text-[10px] leading-none font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
