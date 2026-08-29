'use client';

import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Eye, MessageSquare } from 'lucide-react';
import { useContacts } from '@/features/admin/useContacts';

const statusColors: Record<string, string> = {
  NEW: 'text-accent bg-accent/10',
  READ: 'text-primary bg-primary/10',
  REPLIED: 'text-success bg-success/10',
  ARCHIVED: 'text-muted-foreground bg-muted',
};

export default function WebAdminContacts() {
  const {
    contacts,
    loading,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    totalPages,
    selectedContact,
    setSelectedContact,
  } = useContacts();

  return (
    <div>
      <h1 className="text-foreground mb-6 font-[family-name:var(--font-outfit)] text-2xl font-bold">
        Contact Inquiries
      </h1>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search contacts..."
            className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-xl border py-2.5 pr-4 pl-9 text-sm focus:ring-1 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="text-foreground focus:ring-primary/40 rounded-xl border border-white/60 bg-white/40 px-4 py-2.5 text-sm shadow-sm backdrop-blur-md transition-all focus:bg-white/60 focus:ring-2 focus:outline-none"
        >
          <option value="">All</option>
          <option value="NEW">New</option>
          <option value="READ">Read</option>
          <option value="REPLIED">Replied</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="bg-glass overflow-hidden rounded-xl lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-border border-b">
                  {['Name', 'Subject', 'Status', 'Date', ''].map((h) => (
                    <th
                      key={h}
                      className="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-4 py-4">
                        <div className="skeleton h-4 w-full" />
                      </td>
                    </tr>
                  ))
                ) : contacts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-muted-foreground px-4 py-12 text-center text-sm"
                    >
                      No inquiries found
                    </td>
                  </tr>
                ) : (
                  contacts.map((c) => (
                    <motion.tr
                      key={c.publicId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`hover:bg-muted cursor-pointer ${selectedContact?.publicId === c.publicId ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedContact(c)}
                    >
                      <td className="text-foreground px-4 py-3 text-sm">{c.name}</td>
                      <td className="text-muted-foreground max-w-[200px] truncate px-4 py-3 text-sm">
                        {c.subject}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[c.status] || ''}`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="text-muted-foreground px-4 py-3 text-sm">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Eye className="text-muted-foreground h-4 w-4" />
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="border-border flex items-center justify-between border-t px-4 py-3">
              <span className="text-muted-foreground text-xs">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="hover:bg-muted rounded-lg p-1.5 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="hover:bg-muted rounded-lg p-1.5 disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className="bg-glass rounded-xl p-6">
          {selectedContact ? (
            <div>
              <h3 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
                <MessageSquare className="text-primary h-4 w-4" /> Inquiry Details
              </h3>
              <div className="space-y-3 text-sm">
                {Object.entries({
                  Name: selectedContact.name,
                  Email: selectedContact.email,
                  Phone: selectedContact.phone || '—',
                  Subject: selectedContact.subject,
                  Date: new Date(selectedContact.createdAt).toLocaleString(),
                }).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-muted-foreground text-xs">{k}</span>
                    <p className="text-foreground">{v}</p>
                  </div>
                ))}
                <div>
                  <span className="text-muted-foreground text-xs">Message</span>
                  <p className="text-foreground mt-1 whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
              Select an inquiry to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
