'use client';
import Image from 'next/image';
import { LogOut, Bell, ChevronLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface NavLink {
  readonly label: string;
  readonly href: string;
  readonly icon: string;
}

interface TopAppBarProps {
  userName: string;
  onLogout: () => void;
  navLinks: readonly NavLink[];
}

export function TopAppBar({ userName, onLogout, navLinks }: TopAppBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isRootPage = navLinks.some((link) => link.href === pathname);

  return (
    <header className="bg-background/80 border-border pt-safe fixed top-0 right-0 left-0 z-50 flex min-h-[4rem] items-center justify-between border-b px-4 py-2 backdrop-blur-md">
      <div className="flex items-center gap-2">
        {!isRootPage && (
          <button
            onClick={() => router.back()}
            className="text-foreground hover:bg-muted mr-1 -ml-2 rounded-full p-2 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        <Image
          src="/mendyr.png"
          loading="eager"
          alt="Mendyr Logo"
          width={90}
          height={30}
          className="h-6 w-auto object-contain"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-foreground relative transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <button
          onClick={onLogout}
          className="text-muted-foreground transition-colors hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
