"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, MessageSquare, Mail, Phone, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useContacts } from "@/features/admin/useContacts";

const statusColors: Record<string, string> = {
  NEW: "text-accent bg-accent/10 border-accent/20",
  READ: "text-primary bg-primary/10 border-primary/20",
  REPLIED: "text-success bg-success/10 border-success/20",
  ARCHIVED: "text-muted-foreground bg-muted border-border",
};

export default function MobileAdminContacts() {
  const { contacts, loading, query, setQuery, statusFilter, setStatusFilter, page, setPage, totalPages } = useContacts();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="pb-24 space-y-4">
      <div className="px-2">
        <h1 className="text-2xl font-bold text-foreground">Inquiries</h1>
        <p className="text-sm text-muted-foreground">Manage user messages</p>
      </div>

      <div className="sticky top-14 z-20 bg-background/95 backdrop-blur pt-2 pb-4 px-2 -mx-2 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            value={query} 
            onChange={(e) => { setQuery(e.target.value); setPage(1); }} 
            placeholder="Search inquiries..." 
            className="w-full pl-9 pr-4 py-3 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-sm" 
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {[{ label: "All", value: "" }, { label: "New", value: "NEW" }, { label: "Read", value: "READ" }, { label: "Replied", value: "REPLIED" }, { label: "Archived", value: "ARCHIVED" }].map(tab => (
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

      <div className="flex flex-col gap-3 px-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-full h-24 bg-card border border-border rounded-3xl animate-pulse" />
          ))
        ) : contacts.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <p className="text-sm font-medium text-foreground">No inquiries found</p>
          </div>
        ) : (
          contacts.map((c, idx) => {
            const isExpanded = expandedId === c.publicId;
            return (
              <motion.div 
                key={c.publicId} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-card border rounded-3xl overflow-hidden shadow-sm transition-colors ${
                  isExpanded ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border'
                }`}
              >
                <div 
                  className="p-4 flex items-start gap-3 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : c.publicId)}
                >
                  <div className={`p-2 rounded-xl border shrink-0 ${statusColors[c.status] || "bg-muted"}`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-foreground text-sm truncate">{c.name}</h3>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-foreground truncate mb-1">{c.subject}</p>
                    <p className={`text-xs text-muted-foreground transition-all duration-300 ${isExpanded ? '' : 'line-clamp-1'}`}>
                      {c.message}
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 border-t border-border/50 bg-muted/10 pt-3"
                    >
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs font-medium truncate">{c.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs font-medium">{c.phone || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs font-medium">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <a href={`mailto:${c.email}`} className="flex-1 py-2.5 bg-primary text-primary-foreground text-xs font-semibold rounded-xl text-center shadow-md active:scale-95 transition-transform">
                          Reply Email
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

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
