'use client';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useAuditLogs } from '@/features/super-admin/useAuditLogs';

export default function WebSuperAdminAuditLogs() {
  const { logs, loading, query, setQuery, page, setPage, totalPages, actionColors } =
    useAuditLogs();

  return (
    <div>
      <h1 className="text-foreground mb-6 flex items-center gap-3 font-[family-name:var(--font-outfit)] text-2xl font-bold">
        <FileText className="text-primary h-6 w-6" /> Audit Logs
      </h1>

      <div className="relative mb-6">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search audit logs..."
          className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-xl border py-2.5 pr-4 pl-9 text-sm focus:ring-1 focus:outline-none sm:w-96"
        />
      </div>

      <div className="bg-glass overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-border border-b">
                {['Actor', 'Action', 'Resource', 'IP', 'Timestamp'].map((h) => (
                  <th
                    key={h}
                    className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-3">
                      <div className="skeleton h-4 w-full" />
                    </td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted-foreground px-4 py-12 text-center text-sm">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-muted"
                  >
                    <td className="px-4 py-3">
                      <div className="text-foreground text-sm">{log.actorName || 'System'}</div>
                      <div className="text-muted-foreground text-xs">{log.actorEmail || ''}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${actionColors[log.action] || 'text-muted-foreground bg-muted'}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-foreground text-sm">{log.resource}</span>
                      {log.resourceId && (
                        <span className="text-muted-foreground ml-1 text-xs">
                          #{log.resourceId.slice(0, 8)}
                        </span>
                      )}
                    </td>
                    <td className="text-muted-foreground px-4 py-3 font-mono text-sm text-xs">
                      {log.ipAddress || '—'}
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-sm">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="border-border flex items-center justify-between border-t px-4 py-3">
            <span className="text-muted-foreground text-xs">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="hover:bg-muted rounded-lg p-1.5 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="hover:bg-muted rounded-lg p-1.5 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
