'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useContacts } from '@/features/admin/useContacts';

const statusColors: Record<string, string> = {
  NEW: 'text-accent bg-accent/10 border-accent/20',
  READ: 'text-primary bg-primary/10 border-primary/20',
  REPLIED: 'text-success bg-success/10 border-success/20',
  ARCHIVED: 'text-muted-foreground bg-muted border-border',
};

export default function MobileAdminContacts() {
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
  } = useContacts();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-4 pb-24">
      <div className="px-2">
        <h1 className="text-foreground text-2xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground text-sm">Manage user messages</p>
      </div>

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
            placeholder="Search inquiries..."
            className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary w-full rounded-2xl border py-3 pr-4 pl-9 text-base shadow-sm focus:outline-none"
          />
        </div>

        <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
          {[
            { label: 'All', value: '' },
            { label: 'New', value: 'NEW' },
            { label: 'Read', value: 'READ' },
            { label: 'Replied', value: 'REPLIED' },
            { label: 'Archived', value: 'ARCHIVED' },
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

      <div className="flex flex-col gap-3 px-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border-border h-24 w-full animate-pulse rounded-3xl border"
            />
          ))
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <MessageSquare className="text-muted-foreground h-8 w-8 opacity-50" />
            </div>
            <p className="text-foreground text-sm font-medium">No inquiries found</p>
          </div>
        ) : (
          contacts.map((c, idx) => {
            const isExpanded = expandedId === c.publicId;
            return (
              <motion.div
                key={c.publicId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-card overflow-hidden rounded-3xl border shadow-sm transition-colors ${
                  isExpanded ? 'border-primary/50 ring-primary/20 ring-1' : 'border-border'
                }`}
              >
                <div
                  className="flex cursor-pointer items-start gap-3 p-4"
                  onClick={() => setExpandedId(isExpanded ? null : c.publicId)}
                >
                  <div
                    className={`shrink-0 rounded-xl border p-2 ${statusColors[c.status] || 'bg-muted'}`}
                  >
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-start justify-between">
                      <h3 className="text-foreground truncate text-sm font-bold">{c.name}</h3>
                      <span className="text-muted-foreground ml-2 text-[10px] whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-foreground mb-1 truncate text-xs font-medium">{c.subject}</p>
                    <p
                      className={`text-muted-foreground text-xs transition-all duration-300 ${isExpanded ? '' : 'line-clamp-1'}`}
                    >
                      {c.message}
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-border/50 bg-muted/10 border-t px-4 pt-3 pb-4"
                    >
                      <div className="mb-4 grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <Mail className="text-muted-foreground h-3.5 w-3.5" />
                          <span className="truncate text-xs font-medium">{c.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="text-muted-foreground h-3.5 w-3.5" />
                          <span className="text-xs font-medium">{c.phone || '—'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="text-muted-foreground h-3.5 w-3.5" />
                          <span className="text-xs font-medium">
                            {new Date(c.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={`mailto:${c.email}`}
                          className="bg-primary text-primary-foreground flex-1 rounded-xl py-2.5 text-center text-xs font-semibold shadow-md transition-transform active:scale-95"
                        >
                          Reply Email
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

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
