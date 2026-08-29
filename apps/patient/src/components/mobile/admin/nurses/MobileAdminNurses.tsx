'use client';

import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';
import { useNurses } from '@/features/admin/useNurses';

const statusColors: Record<string, string> = {
  PENDING: 'text-accent bg-accent/10',
  APPROVED: 'text-success bg-success/10',
  REJECTED: 'text-destructive bg-destructive/10',
};

export default function MobileAdminNurses() {
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
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="px-2">
        <h1 className="text-foreground text-2xl font-bold">Nurses</h1>
        <p className="text-muted-foreground text-sm">Review and manage staff</p>
      </div>

      {/* Search & Filter */}
      <div className="bg-background/95 sticky top-14 z-20 -mx-2 space-y-3 px-2 pt-2 pb-4 backdrop-blur">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search nurses..."
            className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary w-full rounded-2xl border py-3 pr-4 pl-9 text-base shadow-sm focus:outline-none"
          />
        </div>

        {/* Horizontal Scrollable Chips for Status Filter */}
        <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
          {[
            { label: 'All', value: '' },
            { label: 'Pending', value: 'PENDING' },
            { label: 'Approved', value: 'APPROVED' },
            { label: 'Rejected', value: 'REJECTED' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === tab.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card List */}
      <div className="flex flex-col gap-3 px-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border-border h-40 w-full animate-pulse rounded-3xl border"
            />
          ))
        ) : nurses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <UserCheck className="text-muted-foreground h-8 w-8 opacity-50" />
            </div>
            <p className="text-foreground text-sm font-medium">No nurses found</p>
          </div>
        ) : (
          nurses.map((nurse, idx) => (
            <motion.div
              key={nurse.publicId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border-border rounded-3xl border p-4 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-500">
                    {nurse.user.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-foreground text-sm font-bold">{nurse.user.fullName}</h3>
                    <p className="text-muted-foreground text-xs">{nurse.user.email}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${statusColors[nurse.verificationStatus] || ''}`}
                >
                  {nurse.verificationStatus}
                </span>
              </div>

              <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted/30 rounded-xl p-2.5">
                  <span className="text-muted-foreground/70 mb-1 block text-[10px] font-medium tracking-wider uppercase">
                    Phone
                  </span>
                  <span className="text-foreground font-medium">{nurse.user.phone || '—'}</span>
                </div>
                <div className="bg-muted/30 rounded-xl p-2.5">
                  <span className="text-muted-foreground/70 mb-1 block text-[10px] font-medium tracking-wider uppercase">
                    Experience
                  </span>
                  <span className="text-foreground font-medium">{nurse.experience || '—'}</span>
                </div>
              </div>

              {nurse.verificationStatus === 'PENDING' && (
                <div className="border-border/50 mt-3 flex items-center gap-2 border-t pt-3">
                  <button
                    onClick={() => handleAction(nurse.publicId, 'approve')}
                    className="bg-success/10 text-success flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-all active:scale-95"
                  >
                    <CheckCircle className="h-4 w-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(nurse.publicId, 'reject')}
                    className="bg-destructive/10 text-destructive flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-all active:scale-95"
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-2">
          <span className="text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5 text-xs font-medium">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="bg-card border-border rounded-xl border p-2.5 transition-transform active:scale-95 disabled:opacity-50"
            >
              <ChevronLeft className="text-foreground h-4 w-4" />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="bg-card border-border rounded-xl border p-2.5 transition-transform active:scale-95 disabled:opacity-50"
            >
              <ChevronRight className="text-foreground h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
