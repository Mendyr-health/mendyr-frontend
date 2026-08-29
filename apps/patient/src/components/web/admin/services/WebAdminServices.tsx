'use client';

import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useServices } from '@/features/admin/useServices';

export default function WebAdminServices() {
  const { services, loading, query, setQuery, page, setPage, totalPages } = useServices();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-foreground font-[family-name:var(--font-outfit)] text-2xl font-bold">
          Services
        </h1>
        <button className="bg-gradient-primary flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          <Plus className="h-4 w-4" /> Add Service
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
          placeholder="Search services..."
          className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-xl border py-2.5 pr-4 pl-9 text-sm focus:ring-1 focus:outline-none sm:w-96"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-40 rounded-xl" />
          ))
        ) : services.length === 0 ? (
          <p className="text-muted-foreground col-span-full py-12 text-center text-sm">
            No services found
          </p>
        ) : (
          services.map((s, idx) => (
            <motion.div
              key={s.publicId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-glass rounded-xl p-5"
            >
              <div className="mb-3 flex items-start justify-between">
                <h3 className="text-foreground font-semibold">{s.name}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${s.isActive ? 'text-success bg-success/10' : 'text-muted-foreground bg-muted'}`}
                >
                  {s.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                {s.shortDesc || 'No description'}
              </p>
              {s.pricingRange && <p className="text-primary mb-4 text-xs">{s.pricingRange}</p>}
              <div className="border-border flex items-center gap-2 border-t pt-3">
                <button
                  className="hover:bg-muted text-muted-foreground rounded-lg p-1.5"
                  title="Edit"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  className="hover:bg-muted text-muted-foreground rounded-lg p-1.5"
                  title="Toggle"
                >
                  {s.isActive ? (
                    <ToggleRight className="text-success h-3.5 w-3.5" />
                  ) : (
                    <ToggleLeft className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  className="hover:bg-destructive/10 text-destructive rounded-lg p-1.5"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="hover:bg-muted rounded-lg p-2 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-muted-foreground text-xs">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="hover:bg-muted rounded-lg p-2 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
