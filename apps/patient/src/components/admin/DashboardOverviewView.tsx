'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  CalendarCheck,
  ShieldCheck,
  MapPin,
  Filter,
  X,
  Loader2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Input } from '@mendyr/shared-ui/src/ui/input';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import type { DashboardFilters, DashboardOverview } from '@/features/admin/useDashboardOverview';
import { EMPTY_FILTERS } from '@/features/admin/useDashboardOverview';

// Status-breakdown colors follow the codebase's existing convention of reaching for Tailwind's
// stock palette for semantic accents (see WebNurseProfile's verified-badge emerald/amber use)
// rather than adding new design-token colors just for this dashboard.
const VERIFICATION_COLORS: Record<string, string> = {
  approved: 'bg-emerald-500',
  pending: 'bg-amber-400',
  in_review: 'bg-blue-400',
  rejected: 'bg-red-400',
};

const BOOKING_COLORS: Record<string, string> = {
  completed: 'bg-emerald-500',
  in_progress: 'bg-blue-400',
  confirmed: 'bg-blue-300',
  assigned: 'bg-indigo-300',
  en_route: 'bg-indigo-400',
  searching: 'bg-amber-300',
  created: 'bg-slate-300',
  cancelled: 'bg-red-300',
  no_show: 'bg-red-400',
  failed: 'bg-red-500',
};

function StatCard({
  label,
  value,
  icon: Icon,
  loading,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  loading: boolean;
  accent: string;
}) {
  return (
    <div className="bg-glass border-border/50 rounded-2xl border p-5">
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}18` }}
      >
        <Icon className="h-5 w-5" style={{ color: accent }} />
      </div>
      <p className="text-foreground text-2xl font-bold tabular-nums">
        {loading ? <span className="skeleton inline-block h-7 w-14 rounded" /> : value}
      </p>
      <p className="text-muted-foreground mt-1 text-xs">{label}</p>
    </div>
  );
}

function StatusBreakdown({
  title,
  counts,
  colors,
}: {
  title: string;
  counts: Record<string, number>;
  colors: Record<string, string>;
}) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const rows = Object.entries(counts)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="bg-glass border-border/50 rounded-2xl border p-6">
      <h3 className="text-foreground mb-4 font-semibold">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-muted-foreground text-sm">No data yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map(([key, count]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-muted-foreground w-28 shrink-0 text-xs capitalize">
                {key.replace(/_/g, ' ')}
              </span>
              <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                <div
                  className={`h-full rounded-full ${colors[key] || 'bg-primary'}`}
                  style={{ width: `${total ? (count / total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-foreground w-8 shrink-0 text-right text-xs font-semibold tabular-nums">
                {count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SignupTrendChart({ data }: { data: DashboardOverview['dailySignups'] }) {
  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    Patients: d.patients,
    Nurses: d.professionals,
  }));

  return (
    <div className="bg-glass border-border/50 rounded-2xl border p-6">
      <h3 className="text-foreground mb-4 font-semibold">Signups over time</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ left: -20, right: 10, top: 10 }}>
            <defs>
              <linearGradient id="patientsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="nursesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 12,
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="Patients"
              stroke="var(--color-primary)"
              fill="url(#patientsFill)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="Nurses"
              stroke="#10b981"
              fill="url(#nursesFill)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LocationList({ locations }: { locations: DashboardOverview['topLocations'] }) {
  const max = Math.max(1, ...locations.map((l) => l.patientCount));
  return (
    <div className="bg-glass border-border/50 rounded-2xl border p-6">
      <h3 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
        <MapPin className="text-primary h-4 w-4" />
        Patients by location
      </h3>
      {locations.length === 0 ? (
        <p className="text-muted-foreground text-sm">No addresses on file yet.</p>
      ) : (
        <div className="space-y-3">
          {locations.map((loc) => (
            <div key={`${loc.city}-${loc.state}`} className="flex items-center gap-3">
              <span className="text-foreground w-32 shrink-0 truncate text-sm font-medium">
                {loc.city}
                <span className="text-muted-foreground font-normal">, {loc.state}</span>
              </span>
              <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${(loc.patientCount / max) * 100}%` }}
                />
              </div>
              <span className="text-foreground w-8 shrink-0 text-right text-xs font-semibold tabular-nums">
                {loc.patientCount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterBar({
  filters,
  onApply,
}: {
  filters: DashboardFilters;
  onApply: (f: DashboardFilters) => void;
}) {
  const [draft, setDraft] = useState(filters);
  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="bg-glass border-border/50 mb-6 flex flex-wrap items-end gap-3 rounded-2xl border p-4">
      <div className="flex items-center gap-2 pr-2">
        <Filter className="text-muted-foreground h-4 w-4" />
        <span className="text-muted-foreground text-xs font-semibold uppercase">Filters</span>
      </div>
      <div className="min-w-[140px] flex-1">
        <label className="text-muted-foreground mb-1 block text-xs">City</label>
        <Input
          value={draft.city}
          onChange={(e) => setDraft({ ...draft, city: e.target.value })}
          placeholder="e.g. Bengaluru"
          className="h-9"
        />
      </div>
      <div className="min-w-[140px] flex-1">
        <label className="text-muted-foreground mb-1 block text-xs">State</label>
        <Input
          value={draft.state}
          onChange={(e) => setDraft({ ...draft, state: e.target.value })}
          placeholder="e.g. Karnataka"
          className="h-9"
        />
      </div>
      <div className="min-w-[130px]">
        <label className="text-muted-foreground mb-1 block text-xs">From</label>
        <Input
          type="date"
          value={draft.dateFrom}
          onChange={(e) => setDraft({ ...draft, dateFrom: e.target.value })}
          className="h-9"
        />
      </div>
      <div className="min-w-[130px]">
        <label className="text-muted-foreground mb-1 block text-xs">To</label>
        <Input
          type="date"
          value={draft.dateTo}
          onChange={(e) => setDraft({ ...draft, dateTo: e.target.value })}
          className="h-9"
        />
      </div>
      <Button size="sm" className="h-9" onClick={() => onApply(draft)}>
        Apply
      </Button>
      {hasActiveFilters && (
        <Button
          size="sm"
          variant="ghost"
          className="h-9"
          onClick={() => {
            setDraft(EMPTY_FILTERS);
            onApply(EMPTY_FILTERS);
          }}
        >
          <X className="mr-1 h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}

export function DashboardOverviewView({
  data,
  loading,
  error,
  filters,
  onApplyFilters,
}: {
  data: DashboardOverview | null;
  loading: boolean;
  error: string;
  filters: DashboardFilters;
  onApplyFilters: (f: DashboardFilters) => void;
}) {
  const d = data ?? {
    totalPatients: 0,
    totalProfessionals: 0,
    professionalsByVerificationStatus: {},
    totalBookings: 0,
    bookingsByStatus: {},
    dailySignups: [],
    topLocations: [],
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-foreground font-[family-name:var(--font-outfit)] text-2xl font-bold">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Registrations, bookings, and where your patients are.
          </p>
        </div>
        {loading && <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />}
      </div>

      <FilterBar filters={filters} onApply={onApplyFilters} />

      {error && (
        <div className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <StatCard
            label="Total Patients"
            value={d.totalPatients}
            icon={Users}
            loading={loading}
            accent="var(--color-primary)"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <StatCard
            label="Total Nurses"
            value={d.totalProfessionals}
            icon={UserCheck}
            loading={loading}
            accent="#10b981"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            label="Verified Nurses"
            value={d.professionalsByVerificationStatus.approved || 0}
            icon={ShieldCheck}
            loading={loading}
            accent="#0ea5e9"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <StatCard
            label="Total Bookings"
            value={d.totalBookings}
            icon={CalendarCheck}
            loading={loading}
            accent="#f59e0b"
          />
        </motion.div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SignupTrendChart data={d.dailySignups} />
        </div>
        <LocationList locations={d.topLocations} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StatusBreakdown
          title="Nurse verification status"
          counts={d.professionalsByVerificationStatus}
          colors={VERIFICATION_COLORS}
        />
        <StatusBreakdown
          title="Booking status"
          counts={d.bookingsByStatus}
          colors={BOOKING_COLORS}
        />
      </div>
    </div>
  );
}
