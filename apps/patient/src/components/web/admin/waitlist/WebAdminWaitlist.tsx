'use client';

import { motion } from 'framer-motion';
import { Search, Download, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { useWaitlist } from '@/features/admin/useWaitlist';

export default function WebAdminWaitlist() {
  const { entries, loading, query, setQuery, page, setPage, totalPages, total, handleExport } =
    useWaitlist();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-foreground font-[family-name:var(--font-outfit)] text-2xl font-bold">
            Waitlist
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">{total} total entries</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-gradient-primary flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search waitlist..."
          className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-xl border py-2.5 pr-4 pl-9 text-sm focus:ring-1 focus:outline-none sm:w-96"
        />
      </div>

      <div className="bg-glass overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-border border-b">
                {['Email', 'Name', 'Phone', 'Source', 'Notified', 'Date'].map((h) => (
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
                    <td colSpan={6} className="px-4 py-4">
                      <div className="skeleton h-4 w-full" />
                    </td>
                  </tr>
                ))
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-muted-foreground px-4 py-12 text-center text-sm">
                    No entries found
                  </td>
                </tr>
              ) : (
                entries.map((e) => (
                  <motion.tr
                    key={e.publicId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-muted"
                  >
                    <td className="text-foreground px-4 py-3 text-sm">
                      <Mail className="text-muted-foreground mr-2 inline h-3 w-3" />
                      {e.email}
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-sm">{e.name || '—'}</td>
                    <td className="text-muted-foreground px-4 py-3 text-sm">{e.phone || '—'}</td>
                    <td className="text-muted-foreground px-4 py-3 text-sm">{e.source || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${e.notified ? 'text-success bg-success/10' : 'text-muted-foreground bg-muted'}`}
                      >
                        {e.notified ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-sm">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-border bg-muted/10 flex items-center justify-between border-t px-4 py-3">
            <span className="text-muted-foreground text-xs">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="hover:bg-muted rounded-lg p-1.5 disabled:opacity-30"
              >
                <ChevronLeft className="text-muted-foreground h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="hover:bg-muted rounded-lg p-1.5 disabled:opacity-30"
              >
                <ChevronRight className="text-muted-foreground h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
