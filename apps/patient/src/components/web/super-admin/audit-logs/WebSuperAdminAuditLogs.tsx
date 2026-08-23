"use client";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useAuditLogs } from "@/features/super-admin/useAuditLogs";

export default function WebSuperAdminAuditLogs() {
  const { logs, loading, query, setQuery, page, setPage, totalPages, actionColors } = useAuditLogs();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-outfit)] mb-6 flex items-center gap-3">
        <FileText className="w-6 h-6 text-primary" /> Audit Logs
      </h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search audit logs..." className="w-full sm:w-96 pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>

      <div className="bg-glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-border">
              {["Actor", "Action", "Resource", "IP", "Timestamp"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {loading ? Array.from({ length: 10 }).map((_, i) => <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="skeleton h-4 w-full" /></td></tr>) : logs.length === 0 ? <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">No audit logs found</td></tr> : logs.map((log) => (
                <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-muted">
                  <td className="px-4 py-3">
                    <div className="text-sm text-foreground">{log.actorName || "System"}</div>
                    <div className="text-xs text-muted-foreground">{log.actorEmail || ""}</div>
                  </td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${actionColors[log.action] || "text-muted-foreground bg-muted"}`}>{log.action}</span></td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{log.resource}</span>
                    {log.resourceId && <span className="text-xs text-muted-foreground ml-1">#{log.resourceId.slice(0, 8)}</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono text-xs">{log.ipAddress || "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
