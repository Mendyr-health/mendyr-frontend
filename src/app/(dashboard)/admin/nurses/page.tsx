"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Filter, UserCheck, CheckCircle, XCircle, Clock, Eye, ChevronLeft, ChevronRight } from "lucide-react";

interface NurseEntry {
  publicId: string;
  verificationStatus: string;
  experience: string | null;
  user: { publicId: string; email: string; fullName: string; phone: string | null; status: string; createdAt: string };
}

export default function AdminNursesPage() {
  const searchParams = useSearchParams();
  const [nurses, setNurses] = useState<NurseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchNurses = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      entity: "nurses",
      page: String(page),
      limit: "20",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (statusFilter) params.set("status", statusFilter);

    try {
      const res = await fetch(`/api/v1/search?${params}`);
      const data = await res.json();
      if (data.success) {
        setNurses(data.data || []);
        setTotalPages(data.meta?.totalPages || 1);
      }
    } catch {/* */} finally { setLoading(false); }
  }, [debouncedQuery, statusFilter, page]);

  useEffect(() => { fetchNurses(); }, [fetchNurses]);

  const handleAction = async (publicId: string, action: "approve" | "reject") => {
    await fetch(`/api/v1/admin/nurses/${publicId}/${action}`, { method: "POST" });
    fetchNurses();
  };

  const statusColors: Record<string, string> = {
    PENDING: "text-accent bg-accent/10",
    APPROVED: "text-success bg-success/10",
    REJECTED: "text-destructive bg-destructive/10",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-outfit)] mb-6">Nurse Management</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search by name, email, phone..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Experience</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="skeleton h-4 w-full" /></td></tr>
                ))
              ) : nurses.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">No nurses found</td></tr>
              ) : (
                nurses.map((nurse) => (
                  <motion.tr key={nurse.publicId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-muted">
                    <td className="px-4 py-3 text-sm text-foreground">{nurse.user.fullName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{nurse.user.email}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{nurse.user.phone || "—"}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{nurse.experience || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[nurse.verificationStatus] || ""}`}>
                        {nurse.verificationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {nurse.verificationStatus === "PENDING" && (
                          <>
                            <button onClick={() => handleAction(nurse.publicId, "approve")} className="p-1.5 rounded-lg hover:bg-success/10 text-success" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                            <button onClick={() => handleAction(nurse.publicId, "reject")} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive" title="Reject"><XCircle className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
