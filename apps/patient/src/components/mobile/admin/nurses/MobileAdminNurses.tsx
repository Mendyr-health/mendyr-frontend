"use client";

import { motion } from "framer-motion";
import { Search, CheckCircle, XCircle, ChevronLeft, ChevronRight, UserCheck } from "lucide-react";
import { useNurses } from "@/features/admin/useNurses";

const statusColors: Record<string, string> = {
  PENDING: "text-accent bg-accent/10",
  APPROVED: "text-success bg-success/10",
  REJECTED: "text-destructive bg-destructive/10",
};

export default function MobileAdminNurses() {
  const { nurses, loading, query, setQuery, statusFilter, setStatusFilter, page, setPage, totalPages, handleAction } = useNurses();

  return (
    <div className="pb-24 space-y-4">
      {/* Header */}
      <div className="px-2">
        <h1 className="text-2xl font-bold text-foreground">Nurses</h1>
        <p className="text-sm text-muted-foreground">Review and manage staff</p>
      </div>

      {/* Search & Filter */}
      <div className="sticky top-14 z-20 bg-background/95 backdrop-blur pt-2 pb-4 px-2 -mx-2 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            value={query} 
            onChange={(e) => { setQuery(e.target.value); setPage(1); }} 
            placeholder="Search nurses..." 
            className="w-full pl-9 pr-4 py-3 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-sm" 
          />
        </div>
        
        {/* Horizontal Scrollable Chips for Status Filter */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {[{ label: "All", value: "" }, { label: "Pending", value: "PENDING" }, { label: "Approved", value: "APPROVED" }, { label: "Rejected", value: "REJECTED" }].map(tab => (
            <button
              key={tab.value}
              onClick={() => { setStatusFilter(tab.value); setPage(1); }}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                statusFilter === tab.value 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card List */}
      <div className="flex flex-col gap-3 px-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-full h-40 bg-card border border-border rounded-3xl animate-pulse" />
          ))
        ) : nurses.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <UserCheck className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <p className="text-sm font-medium text-foreground">No nurses found</p>
          </div>
        ) : (
          nurses.map((nurse, idx) => (
            <motion.div 
              key={nurse.publicId} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border rounded-3xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-sm">
                    {nurse.user.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{nurse.user.fullName}</h3>
                    <p className="text-xs text-muted-foreground">{nurse.user.email}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${statusColors[nurse.verificationStatus] || ""}`}>
                  {nurse.verificationStatus}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-muted/30 p-2.5 rounded-xl">
                  <span className="block text-muted-foreground/70 uppercase font-medium mb-1 tracking-wider text-[10px]">Phone</span>
                  <span className="font-medium text-foreground">{nurse.user.phone || "—"}</span>
                </div>
                <div className="bg-muted/30 p-2.5 rounded-xl">
                  <span className="block text-muted-foreground/70 uppercase font-medium mb-1 tracking-wider text-[10px]">Experience</span>
                  <span className="font-medium text-foreground">{nurse.experience || "—"}</span>
                </div>
              </div>

              {nurse.verificationStatus === "PENDING" && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                  <button onClick={() => handleAction(nurse.publicId, "approve")} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-success/10 text-success font-semibold active:scale-95 transition-all text-sm">
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => handleAction(nurse.publicId, "reject")} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-destructive/10 text-destructive font-semibold active:scale-95 transition-all text-sm">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
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
