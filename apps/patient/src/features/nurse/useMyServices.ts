import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api-client';

export interface MyService {
  serviceId: string;
  serviceName: string;
  categoryName: string;
  basePrice: number;
  priceOverride: number | null;
  effectivePrice: number;
  isOptedIn: boolean;
}

// Backend shape (app/schemas/professional.py ProfessionalServiceRead) is snake_case.
function adapt(raw: {
  service_id: string;
  service_name: string;
  category_name: string;
  base_price: number;
  price_override: number | null;
  effective_price: number;
  is_opted_in: boolean;
}): MyService {
  return {
    serviceId: raw.service_id,
    serviceName: raw.service_name,
    categoryName: raw.category_name,
    basePrice: raw.base_price,
    priceOverride: raw.price_override,
    effectivePrice: raw.effective_price,
    isOptedIn: raw.is_opted_in,
  };
}

export function useMyServices() {
  const [services, setServices] = useState<MyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/v1/professionals/me/services');
      const json = await res.json();
      if (json.success) {
        setServices(json.data.map(adapt));
      } else {
        setError(json.error?.message || 'Failed to load your services.');
      }
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const updateService = useCallback(
    async (serviceId: string, payload: { isOptedIn: boolean; priceOverride: number | null }) => {
      setSavingId(serviceId);
      try {
        const res = await apiFetch(`/api/v1/professionals/me/services/${serviceId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            is_opted_in: payload.isOptedIn,
            price_override: payload.priceOverride,
          }),
        });
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.error?.message || 'Failed to update pricing.');
        }
        const updated = adapt(json.data);
        setServices((prev) => prev.map((s) => (s.serviceId === serviceId ? updated : s)));
        return updated;
      } finally {
        setSavingId(null);
      }
    },
    [],
  );

  return { services, loading, error, savingId, updateService, refetch: fetchServices };
}
