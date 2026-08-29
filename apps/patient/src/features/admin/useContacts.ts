import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api-client";

export interface ContactEntry {
  publicId: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export function useContacts() {
  const [contacts, setContacts] = useState<ContactEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedContact, setSelectedContact] = useState<ContactEntry | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ entity: "contacts", page: String(page), limit: "20", sortBy: "createdAt", sortOrder: "desc" });
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (statusFilter) params.set("status", statusFilter);
    try {
      const res = await apiFetch(`/api/v1/search?${params}`);
      const data = await res.json();
      if (data.success) { 
        setContacts(data.data || []); 
        setTotalPages(data.meta?.totalPages || 1); 
      }
    } catch {
      // Ignore
    } finally { 
      setLoading(false); 
    }
  }, [debouncedQuery, statusFilter, page]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  return {
    contacts,
    loading,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    totalPages,
    selectedContact,
    setSelectedContact
  };
}
