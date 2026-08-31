import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api-client';

export interface DailySignup {
  date: string;
  patients: number;
  professionals: number;
}

export interface LocationBreakdown {
  city: string;
  state: string;
  patientCount: number;
}

export interface DashboardOverview {
  totalPatients: number;
  totalProfessionals: number;
  professionalsByVerificationStatus: Record<string, number>;
  totalBookings: number;
  bookingsByStatus: Record<string, number>;
  dailySignups: DailySignup[];
  topLocations: LocationBreakdown[];
}

export interface DashboardFilters {
  city: string;
  state: string;
  dateFrom: string;
  dateTo: string;
}

export const EMPTY_FILTERS: DashboardFilters = { city: '', state: '', dateFrom: '', dateTo: '' };

// Backend shape (app/schemas/admin_analytics.py) is snake_case; adapt at the boundary rather
// than push that onto every chart/card consumer.
function adapt(raw: {
  total_patients: number;
  total_professionals: number;
  professionals_by_verification_status: Record<string, number>;
  total_bookings: number;
  bookings_by_status: Record<string, number>;
  daily_signups: { signup_date: string; patients: number; professionals: number }[];
  top_locations: { city: string; state: string; patient_count: number }[];
}): DashboardOverview {
  return {
    totalPatients: raw.total_patients,
    totalProfessionals: raw.total_professionals,
    professionalsByVerificationStatus: raw.professionals_by_verification_status,
    totalBookings: raw.total_bookings,
    bookingsByStatus: raw.bookings_by_status,
    dailySignups: raw.daily_signups.map((d) => ({
      date: d.signup_date,
      patients: d.patients,
      professionals: d.professionals,
    })),
    topLocations: raw.top_locations.map((l) => ({
      city: l.city,
      state: l.state,
      patientCount: l.patient_count,
    })),
  };
}

export function useDashboardOverview() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<DashboardFilters>(EMPTY_FILTERS);

  const fetchOverview = useCallback(async (f: DashboardFilters) => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (f.city) params.set('city', f.city);
    if (f.state) params.set('state', f.state);
    if (f.dateFrom) params.set('date_from', f.dateFrom);
    if (f.dateTo) params.set('date_to', f.dateTo);

    try {
      const res = await apiFetch(`/api/v1/admin/dashboard?${params}`);
      const json = await res.json();
      if (json.success) {
        setData(adapt(json.data));
      } else {
        setError(json.error?.message || 'Failed to load dashboard data.');
      }
    } catch {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview(filters);
    // Only re-fetch when filters actually change (Apply button), not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return { data, loading, error, filters, setFilters, refetch: () => fetchOverview(filters) };
}
