"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Download, ChevronLeft, ChevronRight, Mail, Bell } from "lucide-react";

interface WaitlistEntry {
  publicId: string;
  email: string;
  name: string | null;
  phone: string | null;
  source: string | null;
  notified: boolean;
  createdAt: string;
}

export default function AdminWaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ entity: "waitlist", page: String(page), limit: "20", sortBy: "createdAt", sortOrder: "desc" });
    if (debouncedQuery) params.set("q", debouncedQuery);
    try {
      const res = await fetch(`/api/v1/search?${params}`);
      const data = await res.json();
      if (data.success) { setEntries(data.data || []); setTotalPages(data.meta?.totalPages || 1); setTotal(data.meta?.total || 0); }
    } catch {/* */} finally { setLoading(false); }
  }, [debouncedQuery, page]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const handleExport = () => {
    const csv = ["Email,Name,Phone,Source,Notified,Date", ...entries.map((e) => `${e.email},${e.name || ""},${e.phone || ""},${e.source || ""},${e.notified},${new Date(e.createdAt).toLocaleDateString()}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "mendyr-waitlist.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-outfit)]">Waitlist</h1>
          <p className="text-sm text-muted-foreground mt-1">{total} total entries</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-medium hover:opacity-90"><Download className="w-4 h-4" /> Export CSV</button>
      </div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search waitlist..." className="w-full sm:w-96 pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <div className="bg-glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-border">
              {["Email", "Name", "Phone", "Source", "Notified", "Date"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {loading ? Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="skeleton h-4 w-full" /></td></tr>) : entries.length === 0 ? <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">No entries found</td></tr> : entries.map((e) => (
                <motion.tr key={e.publicId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-muted">
                  <td className="px-4 py-3 text-sm text-foreground"><Mail className="w-3 h-3 inline mr-2 text-muted-foreground" />{e.email}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{e.name || "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{e.phone || "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{e.source || "—"}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${e.notified ? "text-success bg-success/10" : "text-muted-foreground bg-muted"}`}>{e.notified ? "Yes" : "No"}</span></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(e.createdAt).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30"><ChevronLeft className="w-4 h-4 text-muted-foreground" /></button>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30"><ChevronRight className="w-4 h-4 text-muted-foreground" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
