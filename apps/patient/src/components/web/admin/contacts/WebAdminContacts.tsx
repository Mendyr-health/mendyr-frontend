"use client";

import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Eye, MessageSquare } from "lucide-react";
import { useContacts } from "@/features/admin/useContacts";

const statusColors: Record<string, string> = {
  NEW: "text-accent bg-accent/10",
  READ: "text-primary bg-primary/10",
  REPLIED: "text-success bg-success/10",
  ARCHIVED: "text-muted-foreground bg-muted",
};

export default function WebAdminContacts() {
  const { contacts, loading, query, setQuery, statusFilter, setStatusFilter, page, setPage, totalPages, selectedContact, setSelectedContact } = useContacts();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-outfit)] mb-6">Contact Inquiries</h1>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            value={query} 
            onChange={(e) => { setQuery(e.target.value); setPage(1); }} 
            placeholder="Search contacts..." 
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" 
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} 
          className="px-4 py-2.5 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 text-sm text-foreground focus:outline-none focus:bg-white/60 focus:ring-2 focus:ring-primary/40 shadow-sm transition-all"
        >
          <option value="">All</option>
          <option value="NEW">New</option>
          <option value="READ">Read</option>
          <option value="REPLIED">Replied</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Name", "Subject", "Status", "Date", ""].map((h) => 
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="px-4 py-4"><div className="skeleton h-4 w-full" /></td></tr>
                  ))
                ) : contacts.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">No inquiries found</td></tr>
                ) : (
                  contacts.map((c) => (
                    <motion.tr 
                      key={c.publicId} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className={`hover:bg-muted cursor-pointer ${selectedContact?.publicId === c.publicId ? "bg-muted" : ""}`} 
                      onClick={() => setSelectedContact(c)}
                    >
                      <td className="px-4 py-3 text-sm text-foreground">{c.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground truncate max-w-[200px]">{c.subject}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[c.status] || ""}`}>{c.status}</span></td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3"><Eye className="w-4 h-4 text-muted-foreground" /></td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
              <div className="flex gap-1">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="bg-glass rounded-xl p-6">
          {selectedContact ? (
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> Inquiry Details</h3>
              <div className="space-y-3 text-sm">
                {Object.entries({ Name: selectedContact.name, Email: selectedContact.email, Phone: selectedContact.phone || "—", Subject: selectedContact.subject, Date: new Date(selectedContact.createdAt).toLocaleString() }).map(([k, v]) => (
                  <div key={k}><span className="text-muted-foreground text-xs">{k}</span><p className="text-foreground">{v}</p></div>
                ))}
                <div><span className="text-muted-foreground text-xs">Message</span><p className="text-foreground whitespace-pre-wrap mt-1">{selectedContact.message}</p></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">Select an inquiry to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}
