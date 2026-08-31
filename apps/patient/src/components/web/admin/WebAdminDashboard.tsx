'use client';

import { useDashboardOverview } from '@/features/admin/useDashboardOverview';
import { DashboardOverviewView } from '@/components/admin/DashboardOverviewView';

export default function WebAdminDashboard() {
  const { data, loading, error, filters, setFilters } = useDashboardOverview();

  return (
    <DashboardOverviewView
      data={data}
      loading={loading}
      error={error}
      filters={filters}
      onApplyFilters={setFilters}
    />
  );
}
