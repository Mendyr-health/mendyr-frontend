'use client';

import { motion } from 'framer-motion';
import { Search, Filter, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNurses } from '@/features/admin/useNurses';

const statusColors: Record<string, string> = {
  PENDING: 'text-accent bg-accent/10',
  APPROVED: 'text-success bg-success/10',
  REJECTED: 'text-destructive bg-destructive/10',
};

export default function WebAdminNurses() {
  const {
    nurses,
    loading,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    totalPages,
    handleAction,
  } = useNurses();

  return (
    <div>
      <h1 className="text-foreground mb-6 font-[family-name:var(--font-outfit)] text-2xl font-bold">
        Nurse Management
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
            placeholder="Search by name, email, phone..."
            className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-xl border py-2.5 pr-4 pl-9 text-sm focus:ring-1 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-muted-foreground h-4 w-4" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-muted border-border text-foreground focus:ring-primary rounded-xl border px-4 py-2.5 text-sm focus:ring-1 focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-glass overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-border bg-muted/30 border-b">
                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                  Name
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                  Email
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                  Phone
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                  Experience
                </th>
                <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                  Status
                </th>
                <th className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-4">
                      <div className="bg-muted/50 h-12 w-full animate-pulse rounded-xl" />
                    </td>
                  </tr>
                ))
              ) : nurses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-muted-foreground px-4 py-12 text-center text-sm">
                    No nurses found
                  </td>
                </tr>
              ) : (
                nurses.map((nurse) => (
                  <motion.tr
                    key={nurse.publicId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="text-foreground px-4 py-4 text-sm font-medium">
                      {nurse.user.fullName}
                    </td>
                    <td className="text-muted-foreground px-4 py-4 text-sm">{nurse.user.email}</td>
                    <td className="text-muted-foreground px-4 py-4 text-sm">
                      {nurse.user.phone || '—'}
                    </td>
                    <td className="text-muted-foreground px-4 py-4 text-sm">
                      {nurse.experience || '—'}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[nurse.verificationStatus] || ''}`}
                      >
                        {nurse.verificationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {nurse.verificationStatus === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleAction(nurse.publicId, 'approve')}
                              className="bg-success/10 hover:bg-success/20 text-success rounded-xl p-2 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleAction(nurse.publicId, 'reject')}
                              className="bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-xl p-2 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
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
