'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useAppointments } from '@/features/nurse/useAppointments';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Calendar,
  DollarSign,
  MapPin,
  Check,
  X,
  Play,
  ArrowRight,
  Stethoscope,
  TrendingUp,
  Activity,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@mendyr/shared-ui/src/ui/button';

const statusConfig: Record<
  string,
  { icon: React.ReactNode; color: string; label: string; desc: string }
> = {
  PENDING: {
    icon: <Clock className="h-6 w-6 text-amber-400" />,
    color: 'amber',
    label: 'Pending Review',
    desc: 'Your application has been submitted and is awaiting review by our team.',
  },
  UNDER_REVIEW: {
    icon: <AlertCircle className="h-6 w-6 text-blue-400" />,
    color: 'blue',
    label: 'Under Review',
    desc: 'An admin is currently reviewing your credentials and documents.',
  },
  APPROVED: {
    icon: <CheckCircle className="h-6 w-6 text-emerald-400" />,
    color: 'emerald',
    label: 'Approved & Verified',
    desc: 'Congratulations! Your profile is active. You can now accept patient care bookings below.',
  },
  REJECTED: {
    icon: <XCircle className="h-6 w-6 text-red-400" />,
    color: 'red',
    label: 'Rejected',
    desc: 'Unfortunately, your application was not approved. Please check the rejection reason and reapply.',
  },
};

export default function WebNurseDashboard() {
  const { user } = useAuth();
  const {
    pendingRequests,
    acceptedVisits,
    inProgressVisits,
    acceptAppointment,
    rejectAppointment,
    startVisit,
    getEarningsSummary,
  } = useAppointments();
  const summary = getEarningsSummary();

  const status: string = user?.status || 'APPROVED'; // Default to APPROVED for demo so nurse can test accepting appointments!
  const config = statusConfig[status] || statusConfig.APPROVED;

  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-foreground font-outfit text-2xl font-bold md:text-3xl">
            Welcome back,{' '}
            <span className="text-primary">{user?.fullName?.split(' ')[0] || 'Nurse Keshav'}</span>{' '}
            👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here is your live clinical dashboard and daily schedule.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/nurse/appointments">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 h-11 gap-2 rounded-xl font-semibold shadow-lg">
              <Calendar className="h-4 w-4" /> View All Appointments (
              {pendingRequests.length + acceptedVisits.length})
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Pending Requests',
            val: pendingRequests.length,
            desc: 'Awaiting your acceptance',
            icon: AlertCircle,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10 border-amber-500/30',
            href: '/nurse/appointments',
          },
          {
            title: "Today's Earnings",
            val: `₹${summary.todayEarnings.toLocaleString('en-IN')}`,
            desc: 'Direct deposit balance',
            icon: TrendingUp,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/30',
            href: '/nurse/earnings',
          },
          {
            title: 'Active / Scheduled',
            val: acceptedVisits.length + inProgressVisits.length,
            desc: 'Shifts to complete today',
            icon: Stethoscope,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10 border-blue-500/30',
            href: '/nurse/appointments',
          },
          {
            title: 'Verification Status',
            val: config.label,
            desc: 'Aadhaar & License check',
            icon: CheckCircle,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10 border-purple-500/30',
            href: '/nurse/status',
          },
        ].map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link
              href={item.href}
              className="bg-glass border-border hover:border-primary/50 group block flex h-full flex-col justify-between rounded-2xl border p-5 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  {item.title}
                </span>
                <div className={`rounded-xl border p-2 ${item.bg}`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-foreground font-outfit group-hover:text-primary text-xl font-black transition-colors md:text-2xl">
                  {item.val}
                </div>
                <p className="text-muted-foreground mt-0.5 text-xs">{item.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Active Shift Banner (if any in progress) */}
      {inProgressVisits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="via-glass to-glass flex flex-col items-start justify-between gap-6 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/20 p-6 shadow-xl shadow-emerald-500/5 md:flex-row md:items-center"
        >
          <div className="flex items-center gap-4">
            <div className="shrink-0 animate-bounce rounded-2xl bg-emerald-500 p-3.5 text-white">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold tracking-wide text-emerald-400 uppercase">
                  Visit In Progress
                </span>
                <span className="text-muted-foreground text-xs">
                  Started at {inProgressVisits[0].checkInTime}
                </span>
              </div>
              <h2 className="text-foreground mt-1 text-lg font-bold">
                Currently caring for {inProgressVisits[0].patientName} —{' '}
                <span className="text-emerald-400">{inProgressVisits[0].serviceName}</span>
              </h2>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {inProgressVisits[0].location.address}, {inProgressVisits[0].location.city}
              </p>
            </div>
          </div>
          <Link href="/nurse/appointments">
            <Button className="h-11 shrink-0 gap-2 rounded-xl bg-emerald-500 px-6 font-bold text-white hover:bg-emerald-600">
              Log Report & Complete Shift <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Live Widget: Incoming Pending Appointment Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-glass border-border rounded-2xl border p-6 md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-foreground flex items-center gap-2 text-lg font-bold">
              <Clock className="h-5 w-5 text-amber-400" /> Incoming Appointment Requests (
              {pendingRequests.length})
            </h3>
            <p className="text-muted-foreground text-sm">
              Accept requests quickly to confirm shifts and lock in payouts.
            </p>
          </div>
          <Link
            href="/nurse/appointments"
            className="text-primary flex items-center gap-1 text-sm font-semibold hover:underline"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-muted-foreground bg-muted/20 border-border/60 rounded-xl border border-dashed py-8 text-center">
            <CheckCircle className="mx-auto mb-2 h-8 w-8 text-emerald-400 opacity-80" />
            <p className="text-sm font-medium">No pending appointment requests right now.</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              You are all caught up! New patient bookings will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {pendingRequests.map((apt) => (
              <div
                key={apt.publicId}
                className="bg-card border-border flex flex-col justify-between space-y-4 rounded-xl border p-5 transition-all hover:border-amber-500/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-foreground text-base font-bold">{apt.patientName}</h4>
                      <span className="bg-primary/10 text-primary mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold">
                        {apt.serviceName}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground block text-xs">Payout</span>
                      <span className="font-outfit text-lg font-black text-emerald-400">
                        ₹{apt.payoutAmount}
                      </span>
                    </div>
                  </div>

                  <div className="text-muted-foreground mt-3 space-y-1.5 text-xs">
                    <p className="text-foreground flex items-center gap-1.5 font-medium">
                      <Clock className="text-primary h-3.5 w-3.5" /> {apt.date} • {apt.timeSlot}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-red-400" /> {apt.location.address} (
                      {apt.location.distanceKm} km away)
                    </p>
                  </div>

                  {apt.specialInstructions && (
                    <div className="bg-muted/40 text-muted-foreground border-border/50 mt-3 line-clamp-2 rounded-lg border p-2.5 text-[11px]">
                      <strong className="text-foreground">Note:</strong> {apt.specialInstructions}
                    </div>
                  )}
                </div>

                <div className="border-border/60 flex items-center gap-2 border-t pt-2">
                  <Button
                    size="sm"
                    onClick={() => acceptAppointment(apt.publicId)}
                    className="h-9 flex-1 gap-1 bg-emerald-500 text-xs font-semibold text-white hover:bg-emerald-600"
                  >
                    <Check className="h-3.5 w-3.5" /> Accept Shift
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectAppointment(apt.publicId, 'Schedule conflict')}
                    className="h-9 flex-1 border-red-500/30 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    <X className="h-3.5 w-3.5" /> Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: 'Appointments & Shifts',
            desc: 'Manage clinical schedule',
            icon: Calendar,
            href: '/nurse/appointments',
            color: 'text-primary',
          },
          {
            title: 'Patient Messages',
            desc: 'Real-time care chat',
            icon: MessageSquare,
            href: '/nurse/messages',
            color: 'text-blue-400',
          },
          {
            title: 'Earnings & Payouts',
            desc: 'View bank statements & rewards',
            icon: DollarSign,
            href: '/nurse/earnings',
            color: 'text-emerald-400',
          },
          {
            title: 'Weekly Availability',
            desc: 'Set working days and hours',
            icon: Clock,
            href: '/nurse/availability',
            color: 'text-amber-400',
          },
          {
            title: 'Documents & Credentials',
            desc: 'Upload license & nursing certificates',
            icon: FileText,
            href: '/nurse/documents',
            color: 'text-purple-400',
          },
          {
            title: 'Profile & Specialty',
            desc: 'Update professional biography',
            icon: User,
            href: '/nurse/profile',
            color: 'text-pink-400',
          },
        ].map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
          >
            <Link
              href={card.href}
              className="bg-glass border-border hover:border-primary group block flex h-full flex-col justify-between rounded-xl border p-5 transition-all"
            >
              <div>
                <card.icon className={`h-6 w-6 ${card.color} mb-3`} />
                <h3 className="text-foreground group-hover:text-primary text-base font-semibold transition-colors">
                  {card.title}
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">{card.desc}</p>
              </div>
              <div className="text-primary mt-4 flex items-center gap-1 text-xs font-semibold transition-transform group-hover:translate-x-1">
                Open <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
