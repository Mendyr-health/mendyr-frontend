'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import {
  Activity,
  CalendarDays,
  ChevronRight,
  HeartPulse,
  MapPin,
  Phone,
  Star,
  ShieldAlert,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { patientDashboardData } from '@/features/patient/dashboardData';
import { useNearbyProviders } from '@/features/patient/useNearbyProviders';

export default function WebPatientDashboard() {
  const { user } = useAuth();
  const [bookedProviderId, setBookedProviderId] = useState<string | null>(null);
  const { appointments, carePlan, healthSummary, emergencyContact } = patientDashboardData;
  const { providers: nearbyProviders, loading: nearbyLoading } = useNearbyProviders();
  const progress = Math.round((carePlan.completed / carePlan.total) * 100);
  const bookedProvider = nearbyProviders.find((provider) => provider.id === bookedProviderId);

  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-primary-light text-sm">Your care, all in one place</p>
        <h1 className="font-outfit text-foreground text-2xl font-bold md:text-3xl">
          Good morning,{' '}
          <span className="text-gradient">{user?.fullName?.split(' ')[0] || 'there'}</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s planned for your care today.
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-glass border-border rounded-2xl border p-6"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 rounded-xl p-3">
              <CalendarDays className="text-primary-light h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-foreground text-lg font-semibold">Next appointment</h2>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
                  {appointments[0].status}
                </span>
              </div>
              <p className="text-muted-foreground mt-1">
                {appointments[0].service} with {appointments[0].clinician}
              </p>
              <p className="text-primary-light mt-2 text-sm">
                {appointments[0].date} · {appointments[0].time}
              </p>
            </div>
          </div>
          <button className="border-primary/40 text-primary-light hover:bg-primary/10 inline-flex items-center gap-2 self-start rounded-lg border px-4 py-2 text-sm font-medium md:self-auto">
            View schedule <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="border-primary/30 from-primary/15 via-card to-card rounded-2xl border bg-gradient-to-r p-6 xl:col-span-2"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-primary text-primary-foreground shadow-primary/20 rounded-2xl p-3 shadow-lg">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div>
                <span className="text-primary text-xs font-bold tracking-wider uppercase">
                  Book care at home
                </span>
                <h2 className="text-foreground mt-1 text-xl font-bold">
                  Find the right care, when you need it.
                </h2>
                <p className="text-muted-foreground mt-1 max-w-lg text-sm">
                  Book a visit with a nearby verified nurse or doctor, or request pharmacy delivery.
                </p>
              </div>
            </div>
            <button
              onClick={() => nearbyProviders[0] && setBookedProviderId(nearbyProviders[0].id)}
              disabled={nearbyProviders.length === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 inline-flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CalendarDays className="h-4 w-4" /> Book appointment
            </button>
          </div>
          {bookedProvider && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Booking request started with{' '}
              {bookedProvider.name}. Choose a time slot to confirm.
            </div>
          )}
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="bg-glass border-border rounded-2xl border p-5"
        >
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            <h2 className="text-foreground font-semibold">Care plan</h2>
          </div>
          <p className="text-foreground mt-4 font-medium">{carePlan.title}</p>
          <p className="text-muted-foreground mt-1 text-sm">{carePlan.nextStep}</p>
          <div className="bg-muted mt-5 h-2 overflow-hidden rounded-full">
            <div className="h-full rounded-full bg-emerald-400" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-emerald-400">{progress}% complete</span>
            <span className="text-muted-foreground">
              {carePlan.completed}/{carePlan.total} tasks
            </span>
          </div>
          <Link
            href="/patient/profile"
            className="text-primary-light mt-5 inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            View care details <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.section>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="bg-glass border-border rounded-2xl border p-6"
      >
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-foreground flex items-center gap-2 text-lg font-bold">
              <MapPin className="text-primary h-5 w-5" /> Nearby care providers
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Verified professionals near your location.
            </p>
          </div>
        </div>
        {nearbyLoading ? (
          <div className="text-muted-foreground py-8 text-center text-sm">
            Finding nearby providers...
          </div>
        ) : nearbyProviders.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center text-sm">
            No available providers near your saved address right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {nearbyProviders.map((provider) => {
              const Icon =
                provider.role === 'Nurse'
                  ? UserRound
                  : provider.role === 'Doctor'
                    ? Stethoscope
                    : Phone;
              const color =
                provider.role === 'Nurse'
                  ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
                  : provider.role === 'Doctor'
                    ? 'text-blue-500 bg-blue-500/10 border-blue-500/30'
                    : 'text-amber-500 bg-amber-500/10 border-amber-500/30';
              return (
                <div
                  key={provider.id}
                  className="border-border bg-card hover:border-primary/50 flex flex-col rounded-xl border p-5 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className={`rounded-xl border p-2.5 ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{' '}
                      {provider.rating}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-foreground font-bold">{provider.name}</p>
                    <p className="text-primary mt-1 text-xs font-semibold">{provider.role}</p>
                    <p className="text-muted-foreground mt-2 text-sm">{provider.specialty}</p>
                  </div>
                  <div className="text-muted-foreground mt-4 flex items-center justify-between text-xs">
                    <span>{provider.distance}</span>
                    <span className="text-emerald-500">{provider.availability}</span>
                  </div>
                  <button
                    onClick={() => setBookedProviderId(provider.id)}
                    className="border-primary/40 text-primary hover:bg-primary/10 mt-4 rounded-lg border py-2 text-sm font-semibold"
                  >
                    {provider.role === 'Pharmacist' ? 'Request delivery' : 'Book now'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </motion.section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
          className="bg-glass border-border rounded-2xl border p-5 lg:col-span-2"
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-rose-400" />
              <h2 className="text-foreground font-semibold">Latest health summary</h2>
            </div>
            <span className="text-muted-foreground text-xs">Updated today</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {healthSummary.map((reading) => (
              <div key={reading.label} className="border-border bg-muted/20 rounded-xl border p-4">
                <p className="text-muted-foreground text-sm">{reading.label}</p>
                <p className="text-foreground mt-2 text-xl font-semibold">
                  {reading.value}{' '}
                  <span className="text-muted-foreground text-xs font-normal">{reading.unit}</span>
                </p>
                <p className="mt-1 text-xs text-emerald-400">In your target range</p>
              </div>
            ))}
          </div>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-5"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-400" />
            <h2 className="text-foreground font-semibold">Emergency contact</h2>
          </div>
          <p className="text-foreground mt-4 font-medium">{emergencyContact.name}</p>
          <p className="text-muted-foreground text-sm">{emergencyContact.relationship}</p>
          <a
            href={`tel:${emergencyContact.phone.replace(/\s/g, '')}`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            <Phone className="h-4 w-4" /> {emergencyContact.phone}
          </a>
        </motion.section>
      </div>
    </div>
  );
}
