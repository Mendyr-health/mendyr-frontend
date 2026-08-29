import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';

export interface NurseEntry {
  publicId: string;
  verificationStatus: string;
  experience: string | null;
  user: {
    publicId: string;
    email: string;
    fullName: string;
    phone: string | null;
    status: string;
    createdAt: string;
  };
}

export function useNurses() {
  const searchParams = useSearchParams();
  const [nurses, setNurses] = useState<NurseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchNurses = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      entity: 'nurses',
      page: String(page),
      limit: '20',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (statusFilter) params.set('status', statusFilter);

    try {
      const res = await apiFetch(`/api/v1/search?${params}`);
      const data = await res.json();
      if (data.success) {
        setNurses(data.data || []);
        setTotalPages(data.meta?.totalPages || 1);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, statusFilter, page]);

  useEffect(() => {
    fetchNurses();
  }, [fetchNurses]);

  const handleAction = async (publicId: string, action: 'approve' | 'reject') => {
    try {
      await apiFetch(`/api/v1/admin/nurses/${publicId}/${action}`, { method: 'POST' });
      fetchNurses();
    } catch {
      // Ignore
    }
  };

  return {
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
  };
}
