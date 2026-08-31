import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api-client';

// Matches the shape `WebPatientDashboard`/`MobilePatientDashboard`'s "Nearby care providers"
// card already renders — adapting to this here means the existing card JSX doesn't need to
// change, only its data source.
export interface NearbyProvider {
  id: string;
  name: string;
  role: 'Nurse' | 'Doctor' | 'Pharmacist';
  specialty: string;
  distance: string;
  rating: number;
  availability: string;
}

function roleFor(professionalType: string): NearbyProvider['role'] {
  return professionalType === 'nurse' ? 'Nurse' : 'Doctor';
}

export function useNearbyProviders() {
  const [providers, setProviders] = useState<NearbyProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [addressesRes, servicesRes] = await Promise.all([
          apiFetch('/api/v1/addresses'),
          apiFetch('/api/v1/services'),
        ]);
        const addressesJson = await addressesRes.json();
        const servicesJson = await servicesRes.json();
        if (!addressesJson.success || !servicesJson.success) return;

        const address =
          addressesJson.data.find((a: { is_default: boolean }) => a.is_default) ||
          addressesJson.data[0];
        // No service picker on the dashboard yet — default to the first Nursing Care service,
        // since that's what every seeded/typical nurse account is opted into. A real service
        // selector (or per-category nearby lists) is a natural next step, not built tonight.
        const service =
          servicesJson.data.find(
            (s: { required_professional_type?: string }) =>
              s.required_professional_type === 'nurse',
          ) || servicesJson.data[0];
        if (!address || !service) return;

        const params = new URLSearchParams({
          service_id: service.id,
          address_id: address.id,
        });
        const res = await apiFetch(`/api/v1/professionals/nearby?${params}`);
        const json = await res.json();
        if (!cancelled && json.success) {
          setProviders(
            json.data.map(
              (p: {
                id: string;
                full_name: string;
                professional_type: string;
                years_of_experience: number;
                average_rating: number;
                distance_km: number;
              }) => ({
                id: p.id,
                name: p.full_name,
                role: roleFor(p.professional_type),
                specialty: `${service.name} · ${p.years_of_experience} yrs exp.`,
                distance: `${p.distance_km} km away`,
                rating: p.average_rating || 0,
                availability: 'Available now',
              }),
            ),
          );
        }
      } catch {
        // Leave providers empty — the dashboard already handles a 0-length list.
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { providers, loading };
}
