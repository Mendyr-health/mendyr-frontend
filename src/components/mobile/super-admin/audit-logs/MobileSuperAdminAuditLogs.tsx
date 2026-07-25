"use client";
import { motion } from "framer-motion";
import { Search, Filter, Server, ChevronLeft, ChevronRight, Hash, Clock } from "lucide-react";
import { useAuditLogs } from "@/features/super-admin/useAuditLogs";

export default function MobileSuperAdminAuditLogs() {
  const { logs, loading, query, setQuery, page, setPage, totalPages, actionColors } = useAuditLogs();

  return (
    <div className="pb-24 space-y-4">
      {/* Header */}
      <div className="px-2 pt-2">
        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">System activity tracking</p>
      </div>

      {/* Search Bar */}
      <div className="px-2 sticky top-4 z-30">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search resources, actions..." 
            className="w-full pl-10 pr-12 py-3.5 bg-card/80 backdrop-blur-xl border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm text-foreground"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl bg-muted text-foreground">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logs List */}
      <div className="px-2 flex flex-col gap-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 h-24 animate-pulse">
              <div className="flex justify-between mb-2">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>
              <div className="h-3 bg-muted rounded w-1/2 mt-4"></div>
            </div>
          ))
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No audit logs found.</div>
        ) : (
          logs.map((log, idx) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx % 10) * 0.05 }}
              className="bg-card border border-border rounded-3xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${actionColors[log.action] || "text-muted-foreground bg-muted"}`}>
                    {log.action}
                  </span>
                  <span className="text-sm font-bold text-foreground flex items-center gap-1">
                    <Server className="w-3.5 h-3.5 text-muted-foreground" />
                    {log.resource}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded">
                  <Clock className="w-3 h-3" />
                  {new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              
              <div className="bg-muted/30 rounded-xl p-3 border border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-foreground">{log.actorName || "System"}</p>
                    {log.actorEmail && <p className="text-[10px] text-muted-foreground">{log.actorEmail}</p>}
                  </div>
                  {log.resourceId && (
                    <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-[10px] font-mono text-muted-foreground">
                      <Hash className="w-3 h-3" />
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
        <div className="flex items-center justify-between px-4 py-4 mt-2">
          <button 
            onClick={() => setPage(Math.max(1, page - 1))} 
            disabled={page === 1} 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-card border border-border active:scale-95 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <span className="text-xs font-bold text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button 
            onClick={() => setPage(Math.min(totalPages, page + 1))} 
            disabled={page === totalPages} 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-card border border-border active:scale-95 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      )}
    </div>
  );
}
