'use client';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import {
  Clock,
  Heart,
  Bell,
  ChevronRight,
  Activity,
  Calendar,
  HeartPulse,
  MapPin,
  Phone,
  ShieldAlert,
  Star,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { patientDashboardData } from '@/features/patient/dashboardData';
import { useNearbyProviders } from '@/features/patient/useNearbyProviders';

export default function MobilePatientDashboard() {
  const { user } = useAuth();
  const [bookedProviderId, setBookedProviderId] = useState<string | null>(null);
  const { carePlan, healthSummary, emergencyContact } = patientDashboardData;
  const { providers: nearbyProviders, loading: nearbyLoading } = useNearbyProviders();
  const progress = Math.round((carePlan.completed / carePlan.total) * 100);
  const bookedProvider = nearbyProviders.find((provider) => provider.id === bookedProviderId);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-muted-foreground text-sm">Good Morning,</p>
        <h1 className="text-foreground text-2xl font-bold">
          {user?.fullName?.split(' ')[0] || 'there'}
        </h1>
      </motion.div>

      {/* Main Action Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-primary/10 border-primary/20 relative overflow-hidden rounded-3xl border p-5"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Heart className="text-primary h-24 w-24" />
        </div>
        <div className="relative z-10">
          <div className="bg-primary/20 text-primary mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span className="bg-primary relative inline-flex h-2 w-2 rounded-full"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase">
              {user?.status?.replace(/_/g, ' ') || 'Waitlisted'}
            </span>
          </div>
          <h2 className="text-foreground mb-1 text-xl font-bold">Coming Soon</h2>
          <p className="text-muted-foreground max-w-[85%] text-sm">
            We are bringing premium healthcare directly to your home. You will be notified once
            services are available in your area.
          </p>
        </div>
      </motion.div>

      {/* Appointment booking */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="border-primary/30 from-primary/15 via-card to-card rounded-3xl border bg-gradient-to-r p-5">
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground shadow-primary/20 rounded-xl p-2.5 shadow-md">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-primary text-[10px] font-bold tracking-wider uppercase">
                Book care at home
              </p>
              <h2 className="text-foreground mt-1 font-bold">Need care today?</h2>
              <p className="text-muted-foreground mt-1 text-xs">
                Choose a nearby nurse, doctor, or pharmacist.
              </p>
            </div>
          </div>
          <button
            onClick={() => nearbyProviders[0] && setBookedProviderId(nearbyProviders[0].id)}
            disabled={nearbyProviders.length === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Calendar className="h-4 w-4" /> Book appointment
          </button>
          {bookedProvider && (
            <p className="mt-3 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-600">
              Request started with {bookedProvider.name}. Choose a time to confirm.
            </p>
          )}
        </div>
      </motion.section>

      {/* Nearby providers */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="text-primary h-5 w-5" />
            <h2 className="text-foreground font-semibold">Nearby care providers</h2>
          </div>
        </div>
        {nearbyLoading ? (
          <div className="text-muted-foreground py-6 text-center text-sm">
            Finding nearby providers...
          </div>
        ) : nearbyProviders.length === 0 ? (
          <div className="text-muted-foreground py-6 text-center text-sm">
            No available providers near your saved address right now.
          </div>
        ) : (
          <div className="space-y-3">
            {nearbyProviders.map((provider) => {
              const Icon =
                provider.role === 'Nurse'
                  ? UserRound
                  : provider.role === 'Doctor'
                    ? Stethoscope
                    : Phone;
              const color =
                provider.role === 'Nurse'
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : provider.role === 'Doctor'
                    ? 'bg-blue-500/10 text-blue-500'
                    : 'bg-amber-500/10 text-amber-500';
              return (
                <div
                  key={provider.id}
                  className="border-border bg-card rounded-2xl border p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-xl p-2 ${color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-foreground text-sm font-bold">{provider.name}</p>
                          <p className="text-primary text-xs font-semibold">{provider.role}</p>
                        </div>
                        <span className="text-muted-foreground flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {provider.rating}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {provider.specialty} · {provider.distance}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs font-medium text-emerald-600">
                          {provider.availability}
                        </span>
                        <button
                          onClick={() => setBookedProviderId(provider.id)}
                          className="text-primary text-xs font-bold"
                        >
                          {provider.role === 'Pharmacist' ? 'Delivery' : 'Book'} →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* Care progress and health readings */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-border bg-card rounded-3xl border p-5 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-500" />
          <h2 className="text-foreground font-semibold">Care plan</h2>
        </div>
        <p className="text-foreground mt-4 text-sm font-medium">{carePlan.title}</p>
        <p className="text-muted-foreground mt-1 text-xs">{carePlan.nextStep}</p>
        <div className="bg-muted mt-4 h-2 overflow-hidden rounded-full">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-xs">
          <span className="font-medium text-emerald-600">{progress}% complete</span>
          <span className="text-muted-foreground">
            {carePlan.completed}/{carePlan.total} tasks
          </span>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="mb-3 flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-rose-500" />
          <h2 className="text-foreground font-semibold">Health summary</h2>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {healthSummary.map((reading) => (
            <div
              key={reading.label}
              className="border-border bg-card rounded-2xl border p-3 shadow-sm"
            >
              <p className="text-muted-foreground min-h-8 text-[10px] leading-4">{reading.label}</p>
              <p className="text-foreground mt-1 text-base font-bold">{reading.value}</p>
              <p className="text-muted-foreground text-[10px]">{reading.unit}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-5"
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-rose-500" />
          <h2 className="text-foreground font-semibold">Emergency contact</h2>
        </div>
        <p className="text-foreground mt-3 text-sm font-semibold">{emergencyContact.name}</p>
        <p className="text-muted-foreground text-xs">{emergencyContact.relationship}</p>
        <a
          href={`tel:${emergencyContact.phone.replace(/\s/g, '')}`}
          className="mt-3 flex items-center gap-2 text-sm font-medium text-rose-600"
        >
          <Phone className="h-4 w-4" /> {emergencyContact.phone}
          <ChevronRight className="ml-auto h-4 w-4" />
        </a>
      </motion.section>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/patient/profile"
            className="bg-card border-border flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-transform active:scale-95"
          >
            <div className="rounded-full bg-blue-500/10 p-3 text-blue-500">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-foreground text-sm font-medium">My Health</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/patient/appointments"
            className="bg-card border-border flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-transform active:scale-95"
          >
            <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-500">
              <Calendar className="h-6 w-6" />
            </div>
            <span className="text-foreground text-sm font-medium">Appointments</span>
          </Link>
        </motion.div>
      </div>

      {/* Recent Activity List (Mobile optimized instead of cards) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-foreground text-lg font-semibold">Updates</h3>
          <button className="text-primary text-sm">View all</button>
        </div>

        <div className="space-y-3">
          <Link
            href="/patient/settings"
            className="bg-card border-border active:bg-muted flex items-center justify-between rounded-2xl border p-4 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-amber-500/10 p-2 text-amber-500">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <p className="text-foreground text-sm font-medium">Waitlist Status Update</p>
                <p className="text-muted-foreground text-xs">
                  You are currently on our priority list.
                </p>
              </div>
            </div>
            <ChevronRight className="text-muted-foreground h-5 w-5" />
          </Link>

          <div className="bg-card border-border flex items-center justify-between rounded-2xl border p-4">
            <div className="flex items-center gap-4">
              <div className="bg-muted text-muted-foreground rounded-full p-2">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-foreground text-sm font-medium">Profile Completed</p>
                <p className="text-muted-foreground text-xs">Your information is secure.</p>
              </div>
            </div>
            <div className="text-muted-foreground text-xs">Just now</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
