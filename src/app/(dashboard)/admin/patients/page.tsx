"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface PatientEntry {
  publicId: string;
  registrationStatus: string;
  user: { publicId: string; email: string; fullName: string; phone: string | null; createdAt: string };
}

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<PatientEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ entity: "patients", page: String(page), limit: "20", sortBy: "createdAt", sortOrder: "desc" });
    if (debouncedQuery) params.set("q", debouncedQuery);
    try {
      const res = await fetch(`/api/v1/search?${params}`);
      const data = await res.json();
      if (data.success) { setPatients(data.data || []); setTotalPages(data.meta?.totalPages || 1); }
    } catch {/* */} finally { setLoading(false); }
  }, [debouncedQuery, page]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-outfit)] mb-6">Patient Management</h1>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search patients..." className="w-full sm:w-96 pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
      </div>
      <div className="bg-glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-border">
              {["Name", "Email", "Phone", "Status", "Registered"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {loading ? Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={5} className="px-4 py-4"><div className="skeleton h-4 w-full" /></td></tr>) : patients.length === 0 ? <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">No patients found</td></tr> : patients.map((p) => (
                <motion.tr key={p.publicId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-muted">
                  <td className="px-4 py-3 text-sm text-foreground">{p.user.fullName}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.user.email}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.user.phone || "—"}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full font-medium text-accent bg-accent/10">{p.registrationStatus}</span></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(p.user.createdAt).toLocaleDateString()}</td>
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
