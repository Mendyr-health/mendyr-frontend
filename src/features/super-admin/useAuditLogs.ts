import { useState, useCallback, useEffect } from "react";

export interface AuditEntry {
  id: string;
  actorName: string | null;
  actorEmail: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { const t = setTimeout(() => setDebouncedQuery(query), 400); return () => clearTimeout(t); }, [query]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/audit-logs?q=${debouncedQuery}&page=${page}&limit=30`);
      const data = await res.json();
      if (data.success) { setLogs(data.data || []); setTotalPages(data.meta?.totalPages || 1); }
    } catch {/* */} finally { setLoading(false); }
  }, [debouncedQuery, page]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const actionColors: Record<string, string> = {
    CREATE: "text-emerald-500 bg-emerald-500/10",
    UPDATE: "text-primary bg-primary/10",
    DELETE: "text-red-500 bg-red-500/10",
    LOGIN: "text-purple-500 bg-purple-500/10",
    LOGOUT: "text-muted-foreground bg-muted",
  };

  return {
    logs, loading, query, setQuery, page, setPage, totalPages, actionColors
  };
}
