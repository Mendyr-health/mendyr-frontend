'use client';

import { motion } from 'framer-motion';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Mail,
  Bell,
  ClipboardList,
} from 'lucide-react';
import { useWaitlist } from '@/features/admin/useWaitlist';

export default function MobileAdminWaitlist() {
  const { entries, loading, query, setQuery, page, setPage, totalPages, total, handleExport } =
    useWaitlist();

  return (
    <div className="space-y-4 pb-24">
      {/* Header with Export Action */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Waitlist</h1>
          <p className="text-muted-foreground text-sm">{total} total entries</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-primary/10 text-primary rounded-full p-3 transition-transform active:scale-95"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>

      {/* Sticky Search Bar */}
      <div className="bg-background/95 sticky top-14 z-20 -mx-2 px-2 pt-2 pb-4 backdrop-blur">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search waitlist..."
            className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary w-full rounded-2xl border py-3 pr-4 pl-9 text-base shadow-sm focus:outline-none"
          />
        </div>
      </div>

      {/* List Cards */}
      <div className="flex flex-col gap-3 px-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border-border h-32 w-full animate-pulse rounded-3xl border"
            />
          ))
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <ClipboardList className="text-muted-foreground h-8 w-8 opacity-50" />
            </div>
            <p className="text-foreground text-sm font-medium">No entries found</p>
          </div>
        ) : (
          entries.map((e, idx) => (
            <motion.div
              key={e.publicId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border-border rounded-3xl border p-4 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-sm font-bold">{e.email}</h3>
                    {e.name && <p className="text-muted-foreground text-xs">{e.name}</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted/30 rounded-xl p-2.5">
                  <span className="text-muted-foreground/70 mb-1 block text-[10px] font-medium tracking-wider uppercase">
                    Registered
                  </span>
                  <span className="text-foreground font-medium">
                    {new Date(e.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="bg-muted/30 rounded-xl p-2.5">
                  <span className="text-muted-foreground/70 mb-1 block text-[10px] font-medium tracking-wider uppercase">
                    Notified
                  </span>
                  <span
                    className={`font-semibold ${e.notified ? 'text-success' : 'text-muted-foreground'}`}
                  >
                    {e.notified ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-2">
          <span className="text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5 text-xs font-medium">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="bg-card border-border rounded-xl border p-2.5 transition-transform active:scale-95 disabled:opacity-50"
            >
              <ChevronLeft className="text-foreground h-4 w-4" />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="bg-card border-border rounded-xl border p-2.5 transition-transform active:scale-95 disabled:opacity-50"
            >
              <ChevronRight className="text-foreground h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
