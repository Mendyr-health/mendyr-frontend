"use client";

import { motion } from "framer-motion";
import { Search, Download, ChevronLeft, ChevronRight, Mail, Bell, ClipboardList } from "lucide-react";
import { useWaitlist } from "@/features/admin/useWaitlist";

export default function MobileAdminWaitlist() {
  const { entries, loading, query, setQuery, page, setPage, totalPages, total, handleExport } = useWaitlist();

  return (
    <div className="pb-24 space-y-4">
      {/* Header with Export Action */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Waitlist</h1>
          <p className="text-sm text-muted-foreground">{total} total entries</p>
        </div>
        <button 
          onClick={handleExport} 
          className="p-3 rounded-full bg-primary/10 text-primary active:scale-95 transition-transform"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Sticky Search Bar */}
      <div className="sticky top-14 z-20 bg-background/95 backdrop-blur pt-2 pb-4 px-2 -mx-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            value={query} 
            onChange={(e) => { setQuery(e.target.value); setPage(1); }} 
            placeholder="Search waitlist..." 
            className="w-full pl-9 pr-4 py-3 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-sm" 
          />
        </div>
      </div>

      {/* List Cards */}
      <div className="flex flex-col gap-3 px-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-full h-32 bg-card border border-border rounded-3xl animate-pulse" />
          ))
        ) : entries.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ClipboardList className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <p className="text-sm font-medium text-foreground">No entries found</p>
          </div>
        ) : (
          entries.map((e, idx) => (
            <motion.div 
              key={e.publicId} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border rounded-3xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{e.email}</h3>
                    {e.name && <p className="text-xs text-muted-foreground">{e.name}</p>}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted/30 p-2.5 rounded-xl">
                  <span className="block text-muted-foreground/70 uppercase font-medium mb-1 tracking-wider text-[10px]">Registered</span>
                  <span className="font-medium text-foreground">{new Date(e.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="bg-muted/30 p-2.5 rounded-xl">
                  <span className="block text-muted-foreground/70 uppercase font-medium mb-1 tracking-wider text-[10px]">Notified</span>
                  <span className={`font-semibold ${e.notified ? "text-success" : "text-muted-foreground"}`}>
                    {e.notified ? "Yes" : "No"}
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
          <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(Math.max(1, page - 1))} 
              disabled={page === 1} 
              className="p-2.5 bg-card border border-border rounded-xl disabled:opacity-50 active:scale-95 transition-transform"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            <button 
              onClick={() => setPage(Math.min(totalPages, page + 1))} 
              disabled={page === totalPages} 
              className="p-2.5 bg-card border border-border rounded-xl disabled:opacity-50 active:scale-95 transition-transform"
            >
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
