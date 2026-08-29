import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api-client';

export interface PatientEntry {
  publicId: string;
  registrationStatus: string;
  user: {
    publicId: string;
    email: string;
    fullName: string;
    phone: string | null;
    createdAt: string;
  };
}

export function usePatients() {
  const [patients, setPatients] = useState<PatientEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      entity: 'patients',
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
        setPatients(data.data || []);
        setTotalPages(data.meta?.totalPages || 1);
      }
    } catch {
      // Ignore errors in this simple implementation
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, page]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    loading,
    query,
    setQuery,
    page,
    setPage,
    totalPages,
  };
}
