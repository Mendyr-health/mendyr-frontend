"use client";

import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { usePatients } from "@/features/admin/usePatients";

export default function WebAdminPatients() {
  const { patients, loading, query, setQuery, page, setPage, totalPages } = usePatients();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-outfit)] mb-6">Patient Management</h1>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          value={query} 
          onChange={(e) => { setQuery(e.target.value); setPage(1); }} 
          placeholder="Search patients..." 
          className="w-full sm:w-96 pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" 
        />
      </div>
      
      <div className="bg-glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Name", "Email", "Phone", "Status", "Registered"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-4">
                      <div className="w-full h-12 bg-muted/50 rounded-xl animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">No patients found</td>
                </tr>
              ) : (
                patients.map((p) => (
                  <motion.tr key={p.publicId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-foreground">{p.user.fullName}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{p.user.email}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{p.user.phone || "—"}</td>
                    <td className="px-4 py-4"><span className="text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider text-accent bg-accent/10">{p.registrationStatus}</span></td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{new Date(p.user.createdAt).toLocaleDateString()}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10">
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
