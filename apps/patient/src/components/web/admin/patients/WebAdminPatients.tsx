'use client';

import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePatients } from '@/features/admin/usePatients';

export default function WebAdminPatients() {
  const { patients, loading, query, setQuery, page, setPage, totalPages } = usePatients();

  return (
    <div>
      <h1 className="text-foreground mb-6 font-[family-name:var(--font-outfit)] text-2xl font-bold">
        Patient Management
      </h1>
      <div className="relative mb-6">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search patients..."
          className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-xl border py-2.5 pr-4 pl-9 text-sm focus:ring-1 focus:outline-none sm:w-96"
        />
      </div>

      <div className="bg-glass overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-border bg-muted/30 border-b">
                {['Name', 'Email', 'Phone', 'Status', 'Registered'].map((h) => (
                  <th
                    key={h}
                    className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-4">
                      <div className="bg-muted/50 h-12 w-full animate-pulse rounded-xl" />
                    </td>
                  </tr>
                ))
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted-foreground px-4 py-12 text-center text-sm">
                    No patients found
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <motion.tr
                    key={p.publicId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="text-foreground px-4 py-4 text-sm font-medium">
                      {p.user.fullName}
                    </td>
                    <td className="text-muted-foreground px-4 py-4 text-sm">{p.user.email}</td>
                    <td className="text-muted-foreground px-4 py-4 text-sm">
                      {p.user.phone || '—'}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-accent bg-accent/10 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase">
                        {p.registrationStatus}
                      </span>
                    </td>
                    <td className="text-muted-foreground px-4 py-4 text-sm">
                      {new Date(p.user.createdAt).toLocaleDateString()}
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
