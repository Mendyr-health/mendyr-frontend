"use client";

import { motion } from "framer-motion";
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Activity, EyeOff, Eye } from "lucide-react";
import { useServices } from "@/features/admin/useServices";

export default function MobileAdminServices() {
  const { services, loading, query, setQuery, page, setPage, totalPages } = useServices();

  return (
    <div className="pb-24 space-y-4">
      {/* Header */}
      <div className="px-2">
        <h1 className="text-2xl font-bold text-foreground">Services</h1>
        <p className="text-sm text-muted-foreground">Manage service catalog</p>
      </div>

      {/* Sticky Search Bar */}
      <div className="sticky top-14 z-20 bg-background/95 backdrop-blur pt-2 pb-4 px-2 -mx-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            value={query} 
            onChange={(e) => { setQuery(e.target.value); setPage(1); }} 
            placeholder="Search services..." 
            className="w-full pl-9 pr-4 py-3 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary shadow-sm" 
          />
        </div>
      </div>

      {/* Card List */}
      <div className="flex flex-col gap-3 px-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-full h-32 bg-card border border-border rounded-3xl animate-pulse" />
          ))
        ) : services.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <p className="text-sm font-medium text-foreground">No services found</p>
          </div>
        ) : (
          services.map((s, idx) => (
            <motion.div 
              key={s.publicId} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border rounded-3xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{s.name}</h3>
                    <p className="text-xs text-primary font-semibold mt-0.5">{s.pricingRange || "Variable pricing"}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{s.shortDesc}</p>
              
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 ${
                  s.isActive ? "text-success bg-success/10" : "text-muted-foreground bg-muted"
                }`}>
                  {s.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {s.isActive ? "Active" : "Hidden"}
                </span>

                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-xl bg-muted/50 text-foreground active:scale-95 transition-transform" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-xl bg-destructive/10 text-destructive active:scale-95 transition-transform" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
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

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl shadow-primary/30 flex items-center justify-center active:scale-90 transition-transform z-40">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
