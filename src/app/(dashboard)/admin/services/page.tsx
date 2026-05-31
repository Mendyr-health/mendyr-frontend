"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight } from "lucide-react";

interface ServiceEntry {
  publicId: string;
  name: string;
  slug: string;
  shortDesc: string | null;
  isActive: boolean;
  pricingRange: string | null;
  createdAt: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { const t = setTimeout(() => setDebouncedQuery(query), 400); return () => clearTimeout(t); }, [query]);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ entity: "services", page: String(page), limit: "20", sortBy: "name", sortOrder: "asc" });
    if (debouncedQuery) params.set("q", debouncedQuery);
    try {
      const res = await fetch(`/api/v1/search?${params}`);
      const data = await res.json();
      if (data.success) { setServices(data.data || []); setTotalPages(data.meta?.totalPages || 1); }
    } catch {/* */} finally { setLoading(false); }
  }, [debouncedQuery, page]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-outfit)]">Services</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search services..." className="w-full sm:w-96 pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-40 rounded-xl" />) : services.length === 0 ? <p className="col-span-full text-center text-sm text-muted-foreground py-12">No services found</p> : services.map((s, idx) => (
          <motion.div key={s.publicId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-glass rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground">{s.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${s.isActive ? "text-success bg-success/10" : "text-muted-foreground bg-muted"}`}>{s.isActive ? "Active" : "Inactive"}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{s.shortDesc || "No description"}</p>
            {s.pricingRange && <p className="text-xs text-primary mb-4">{s.pricingRange}</p>}
            <div className="flex items-center gap-2 border-t border-border pt-3">
              <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" title="Toggle">{s.isActive ? <ToggleRight className="w-3.5 h-3.5 text-success" /> : <ToggleLeft className="w-3.5 h-3.5" />}</button>
              <button className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </motion.div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-muted disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-xs text-muted-foreground">{page} / {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-muted disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}
