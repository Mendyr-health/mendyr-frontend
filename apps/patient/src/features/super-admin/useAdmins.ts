import { useState, useCallback, useEffect } from 'react';
import { apiFetch } from '@/lib/api-client';

export interface AdminEntry {
  publicId: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  createdAt: string;
}

export function useAdmins() {
  const [admins, setAdmins] = useState<AdminEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'ADMIN',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/v1/admin/admins?q=${debouncedQuery}`);
      const data = await res.json();
      if (data.success) setAdmins(data.data || []);
    } catch {
      /* */
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleCreateAdmin = async () => {
    setCreating(true);
    try {
      await apiFetch('/api/v1/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin),
      });
      setShowCreateModal(false);
      setNewAdmin({ fullName: '', email: '', password: '', role: 'ADMIN' });
      fetchAdmins();
    } catch {
      /* */
    } finally {
      setCreating(false);
    }
  };

  const handleSuspend = async (publicId: string) => {
    await apiFetch(`/api/v1/admin/admins/${publicId}/suspend`, { method: 'POST' });
    fetchAdmins();
  };

  return {
    admins,
    loading,
    query,
    setQuery,
    showCreateModal,
    setShowCreateModal,
    newAdmin,
    setNewAdmin,
    creating,
    handleCreateAdmin,
    handleSuspend,
  };
}
