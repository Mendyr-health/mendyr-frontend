import { useState, useEffect, useCallback } from "react";

export interface ServiceEntry {
  publicId: string;
  name: string;
  slug: string;
  shortDesc: string | null;
  isActive: boolean;
  pricingRange: string | null;
  createdAt: string;
}

export function useServices() {
  const [services, setServices] = useState<ServiceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { const t = setTimeout(() => setDebouncedQuery(query), 400); return () => clearTimeout(t); }, [query]);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ entity: "services", page: String(page), limit: "20", sortBy: "name", sortOrder: "asc" });
    if (debouncedQuery) params.set("q", debouncedQuery);
    try {
      const res = await fetch(`/api/v1/search?${params}`);
      const data = await res.json();
      if (data.success) { 
        setServices(data.data || []); 
        setTotalPages(data.meta?.totalPages || 1); 
      }
    } catch {
      // Ignore
    } finally { 
      setLoading(false); 
    }
  }, [debouncedQuery, page]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  return {
    services,
    loading,
    query,
    setQuery,
    page,
    setPage,
    totalPages
  };
}
