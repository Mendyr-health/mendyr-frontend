"use client";

import { Power } from "lucide-react";

interface OnlineStatusToggleProps {
  isOnline: boolean;
  onChange: (online: boolean) => void;
}

export default function OnlineStatusToggle({
  isOnline,
  onChange,
}: OnlineStatusToggleProps) {
  return (
    <div className="flex items-center bg-muted/50 rounded-full p-1 border border-border">
      <button
        onClick={() => onChange(true)}
        className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
          isOnline
            ? "bg-white shadow-sm text-emerald-600"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <span className="hidden sm:inline">Online</span>
        <span className="sm:hidden flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          On
        </span>
      </button>
      <button
        onClick={() => onChange(false)}
        className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
          !isOnline
            ? "bg-white shadow-sm text-rose-600"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <span className="hidden sm:inline">Offline</span>
        <span className="sm:hidden flex items-center gap-1">
          <Power className="w-3 h-3" /> Off
        </span>
      </button>
    </div>
  );
}
