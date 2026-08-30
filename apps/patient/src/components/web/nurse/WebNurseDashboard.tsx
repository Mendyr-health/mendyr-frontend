'use client';

import { useState } from 'react';
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
  MessageSquare,
  Navigation,
  Info,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import dynamic from 'next/dynamic';

const VisitExecutionOverlay = dynamic(() => import('@/components/nurse/VisitExecutionOverlay'));
const CancelVisitModal = dynamic(() => import('@/components/nurse/CancelVisitModal'));
const RequestDetailModal = dynamic(() => import('@/components/nurse/RequestDetailModal'));
const OnlineStatusToggle = dynamic(() => import('@/components/nurse/OnlineStatusToggle'));

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
    cancelVisit,
    startVisit,
    completeVisit,
    getEarningsSummary,
  } = useAppointments();
  const summary = getEarningsSummary();

  // Interactive overlay state
  const [isOnline, setIsOnline] = useState(true);
  const [executionVisit, setExecutionVisit] = useState<any>(null);
  const [cancelVisitId, setCancelVisitId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const status: string = user?.status || 'APPROVED';
  const config = statusConfig[status] || statusConfig.APPROVED;

  const handleStartVisit = (apt: any) => {
    setExecutionVisit({
      publicId: apt.publicId,
      patientName: apt.patientName,
      serviceName: apt.serviceName,
      location: apt.location,
    });
    startVisit(apt.publicId);
  };

  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-foreground font-outfit text-xl font-bold md:text-3xl">
              Welcome back,{' '}
              <span className="text-primary">
                {user?.fullName?.split(' ')[0] || 'Nurse Keshav'}
              </span>{' '}
              👋
            </h1>
            <p className="text-muted-foreground mt-1.5 text-sm">
              {isOnline ? (
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  Searching for nearby requests...
                </span>
              ) : (
                <span className="text-muted-foreground flex items-center gap-2">
                  Offline. Go online to receive requests.
                </span>
              )}
            </p>
          </div>
          <div className="mt-1 shrink-0">
            <OnlineStatusToggle isOnline={isOnline} onChange={setIsOnline} />
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {[
          {
            title: 'Pending',
            val: pendingRequests.length,
            desc: 'Awaiting',
            icon: AlertCircle,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10 border-amber-500/20',
            href: '/nurse/appointments',
          },
          {
            title: 'Active',
            val: acceptedVisits.length + inProgressVisits.length,
            desc: 'Scheduled',
            icon: Stethoscope,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10 border-blue-500/20',
            href: '/nurse/appointments',
          },
          {
            title: "Today's Earnings",
            val: `₹${summary.todayEarnings.toLocaleString('en-IN')}`,
            desc: 'Direct deposit balance',
            icon: TrendingUp,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
            href: '/nurse/earnings',
            colSpan: 'col-span-2 lg:col-span-1',
          },
        ].map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={item.colSpan || 'col-span-1'}
          >
            <Link
              href={item.href}
              className="bg-glass border-border hover:border-primary/50 group block flex h-full flex-col justify-between rounded-2xl border p-4 transition-all sm:p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase sm:text-xs">
                  {item.title}
                </span>
                <div className={`rounded-xl border p-1.5 sm:p-2 ${item.bg}`}>
                  <item.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${item.color}`} />
                </div>
              </div>
              <div className="mt-2 sm:mt-3">
                <div className="text-foreground font-outfit group-hover:text-primary text-xl font-black transition-colors sm:text-2xl">
                  {item.val}
                </div>
                <p className="text-muted-foreground mt-0.5 text-[10px] sm:text-xs">{item.desc}</p>
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
        <div className="mb-2 flex items-center justify-between gap-4">
          <h3 className="text-foreground flex items-center gap-2 text-base font-bold sm:text-lg">
            <Clock className="h-4 w-4 shrink-0 text-amber-400 sm:h-5 sm:w-5" />
            <span className="truncate">Incoming Requests ({pendingRequests.length})</span>
          </h3>
          <Link
            href="/nurse/appointments"
            className="text-primary flex shrink-0 items-center gap-1 text-xs font-semibold hover:underline sm:text-sm"
          >
            View All <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>
        <p className="text-muted-foreground mb-5 text-xs sm:text-sm">
          Accept requests quickly to confirm shifts and lock in payouts.
        </p>

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

                <div className="border-border/60 flex flex-wrap items-center gap-2 border-t pt-3 sm:flex-nowrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedRequest(apt)}
                    className="border-primary/30 text-primary hover:bg-primary/5 h-9 w-full text-xs sm:w-auto"
                  >
                    <Info className="mr-1 h-3.5 w-3.5" /> Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => acceptAppointment(apt.publicId)}
                    className="h-9 w-full flex-1 gap-1 bg-emerald-500 text-xs font-semibold text-white hover:bg-emerald-600 sm:w-auto"
                  >
                    <Check className="h-3.5 w-3.5" /> Accept Shift
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectAppointment(apt.publicId, 'Schedule conflict')}
                    className="h-9 w-full border-red-500/30 text-xs text-red-400 hover:bg-red-500/10 sm:w-auto"
                  >
                    <X className="h-3.5 w-3.5" /> Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Accepted Visits with Start / Cancel controls */}
      {acceptedVisits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-glass border-border rounded-2xl border p-6 md:p-8"
        >
          <h3 className="text-foreground mb-6 flex items-center gap-2 text-lg font-bold">
            <Stethoscope className="h-5 w-5 text-blue-400" /> Confirmed Visits (
            {acceptedVisits.length})
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {acceptedVisits.map((apt) => (
              <div
                key={apt.publicId}
                className="bg-card border-l-primary border-border space-y-3 rounded-xl border border-l-4 p-5 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-foreground font-bold">{apt.patientName}</h4>
                    <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-semibold">
                      {apt.serviceName}
                    </span>
                  </div>
                  <span className="text-primary bg-primary/10 rounded-md px-2 py-1 text-xs font-bold">
                    {apt.timeSlot}
                  </span>
                </div>
                <div className="text-muted-foreground space-y-1 text-xs">
                  <p className="text-foreground flex items-center gap-1.5 font-medium">
                    <Calendar className="text-primary h-3.5 w-3.5" /> {apt.date}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-red-400" /> {apt.location.address}
                  </p>
                </div>
                <div className="border-border/60 flex flex-col gap-2 border-t pt-3 sm:flex-row">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 shadow-primary/20 h-9 w-full flex-1 gap-1.5 text-xs font-semibold text-white shadow-md"
                    onClick={() => handleStartVisit(apt)}
                  >
                    <Navigation className="h-3.5 w-3.5" /> Start Visit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 w-full border-rose-200 text-xs text-rose-500 hover:bg-rose-50 sm:w-auto"
                    onClick={() => setCancelVisitId(apt.publicId)}
                  >
                    <X className="h-3.5 w-3.5" /> Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* --- OVERLAYS --- */}

      {/* Visit Execution Overlay (Map Navigation + OTP + Checklist) */}
      <VisitExecutionOverlay
        visit={executionVisit}
        onClose={() => setExecutionVisit(null)}
        onComplete={(publicId) => completeVisit(publicId, 'Visit completed successfully')}
      />

      {/* Cancel Visit Modal */}
      <CancelVisitModal
        isOpen={!!cancelVisitId}
        onClose={() => setCancelVisitId(null)}
        onConfirm={(reason) => {
          if (cancelVisitId) cancelVisit(cancelVisitId, reason);
          setCancelVisitId(null);
        }}
      />

      {/* Request Detail Modal */}
      <RequestDetailModal
        appointment={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onAccept={(id) => acceptAppointment(id)}
        onDecline={(id) => rejectAppointment(id, 'Schedule conflict')}
      />
    </div>
  );
}
