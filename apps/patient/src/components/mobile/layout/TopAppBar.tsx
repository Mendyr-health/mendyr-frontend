"use client";
import Image from "next/image";
import { LogOut, Bell } from "lucide-react";

interface TopAppBarProps {
  userName: string;
  onLogout: () => void;
}

export function TopAppBar({ userName, onLogout }: TopAppBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border min-h-[4rem] px-4 pt-safe py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image src="/mendyr.png" loading="eager" alt="Mendyr Logo" width={90} height={30} className="h-6 w-auto object-contain" />
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
        </button>
        <button onClick={onLogout} className="text-muted-foreground hover:text-red-400 transition-colors">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
