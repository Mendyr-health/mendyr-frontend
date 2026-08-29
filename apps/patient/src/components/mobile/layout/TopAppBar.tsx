'use client';
import Image from 'next/image';
import { LogOut, Bell } from 'lucide-react';

interface TopAppBarProps {
  userName: string;
  onLogout: () => void;
}

export function TopAppBar({ userName, onLogout }: TopAppBarProps) {
  return (
    <header className="bg-background/80 border-border pt-safe fixed top-0 right-0 left-0 z-50 flex min-h-[4rem] items-center justify-between border-b px-4 py-2 backdrop-blur-md">
      <div className="flex items-center gap-2">
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
