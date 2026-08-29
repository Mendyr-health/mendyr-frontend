import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api-client';

export interface WaitlistEntry {
  publicId: string;
  email: string;
  name: string | null;
  phone: string | null;
  source: string | null;
  notified: boolean;
  createdAt: string;
}

export function useWaitlist() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      entity: 'waitlist',
      page: String(page),
      limit: '20',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    if (debouncedQuery) params.set('q', debouncedQuery);
    try {
      const res = await apiFetch(`/api/v1/search?${params}`);
      const data = await res.json();
      if (data.success) {
        setEntries(data.data || []);
        setTotalPages(data.meta?.totalPages || 1);
        setTotal(data.meta?.total || 0);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleExport = () => {
    const csv = [
      'Email,Name,Phone,Source,Notified,Date',
      ...entries.map(
        (e) =>
          `${e.email},${e.name || ''},${e.phone || ''},${e.source || ''},${e.notified},${new Date(e.createdAt).toLocaleDateString()}`,
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mendyr-waitlist.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    entries,
    loading,
    query,
    setQuery,
    page,
    setPage,
    totalPages,
    total,
    handleExport,
  };
}
