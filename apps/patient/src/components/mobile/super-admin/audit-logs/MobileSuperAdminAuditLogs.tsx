'use client';
import { motion } from 'framer-motion';
import { Search, Filter, Server, ChevronLeft, ChevronRight, Hash, Clock } from 'lucide-react';
import { useAuditLogs } from '@/features/super-admin/useAuditLogs';

export default function MobileSuperAdminAuditLogs() {
  const { logs, loading, query, setQuery, page, setPage, totalPages, actionColors } =
    useAuditLogs();

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="px-2 pt-2">
        <h1 className="text-foreground text-2xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground mt-1 text-sm">System activity tracking</p>
      </div>

      {/* Search Bar */}
      <div className="sticky top-4 z-30 px-2">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search resources, actions..."
            className="bg-card/80 border-border focus:ring-primary/20 focus:border-primary text-foreground w-full rounded-2xl border py-3.5 pr-12 pl-10 text-base shadow-sm backdrop-blur-xl focus:ring-2 focus:outline-none"
          />
          <button className="bg-muted text-foreground absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Logs List */}
      <div className="flex flex-col gap-3 px-2">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border-border h-24 animate-pulse rounded-2xl border p-4"
            >
              <div className="mb-2 flex justify-between">
                <div className="bg-muted h-4 w-1/3 rounded"></div>
                <div className="bg-muted h-4 w-1/4 rounded"></div>
              </div>
              <div className="bg-muted mt-4 h-3 w-1/2 rounded"></div>
            </div>
          ))
        ) : logs.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center text-sm">
            No audit logs found.
          </div>
        ) : (
          logs.map((log, idx) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx % 10) * 0.05 }}
              className="bg-card border-border rounded-3xl border p-4 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${actionColors[log.action] || 'text-muted-foreground bg-muted'}`}
                  >
                    {log.action}
                  </span>
                  <span className="text-foreground flex items-center gap-1 text-sm font-bold">
                    <Server className="text-muted-foreground h-3.5 w-3.5" />
                    {log.resource}
                  </span>
                </div>
                <span className="text-muted-foreground bg-muted flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium">
                  <Clock className="h-3 w-3" />
                  {new Date(log.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="bg-muted/30 border-border/50 rounded-xl border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground text-xs font-bold">{log.actorName || 'System'}</p>
                    {log.actorEmail && (
                      <p className="text-muted-foreground text-[10px]">{log.actorEmail}</p>
                    )}
                  </div>
                  {log.resourceId && (
                    <div className="bg-muted text-muted-foreground flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[10px]">
                      <Hash className="h-3 w-3" />
                      {log.resourceId.slice(0, 8)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-2 flex items-center justify-between px-4 py-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="bg-card border-border flex h-10 w-10 items-center justify-center rounded-full border active:scale-95 disabled:opacity-50"
          >
            <ChevronLeft className="text-foreground h-5 w-5" />
          </button>
          <span className="text-muted-foreground text-xs font-bold">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="bg-card border-border flex h-10 w-10 items-center justify-center rounded-full border active:scale-95 disabled:opacity-50"
          >
            <ChevronRight className="text-foreground h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
