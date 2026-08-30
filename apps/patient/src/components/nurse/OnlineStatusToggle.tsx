'use client';

import { Power } from 'lucide-react';

interface OnlineStatusToggleProps {
  isOnline: boolean;
  onChange: (online: boolean) => void;
}

export default function OnlineStatusToggle({ isOnline, onChange }: OnlineStatusToggleProps) {
  return (
    <div className="bg-muted/50 border-border flex items-center rounded-full border p-1">
      <button
        onClick={() => onChange(true)}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all sm:px-4 sm:text-sm ${
          isOnline
            ? 'bg-white text-emerald-600 shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <span className="hidden sm:inline">Online</span>
        <span className="flex items-center gap-1 sm:hidden">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          On
        </span>
      </button>
      <button
        onClick={() => onChange(false)}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all sm:px-4 sm:text-sm ${
          !isOnline
            ? 'bg-white text-rose-600 shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <span className="hidden sm:inline">Offline</span>
        <span className="flex items-center gap-1 sm:hidden">
          <Power className="h-3 w-3" /> Off
        </span>
      </button>
    </div>
  );
}
