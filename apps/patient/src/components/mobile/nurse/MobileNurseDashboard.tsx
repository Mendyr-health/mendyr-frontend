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
  ChevronRight,
  DollarSign,
  TrendingUp,
  Stethoscope,
  MapPin,
  Check,
  X,
  ArrowRight,
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
  { icon: React.ReactNode; color: string; label: string; desc: string; bg: string }
> = {
  PENDING: {
    icon: <Clock className="h-8 w-8 text-amber-500" />,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    label: 'Pending Review',
    desc: 'Your application is awaiting review.',
  },
  UNDER_REVIEW: {
    icon: <AlertCircle className="h-8 w-8 text-blue-500" />,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    label: 'Under Review',
    desc: 'An admin is reviewing your credentials.',
  },
  APPROVED: {
    icon: <CheckCircle className="h-8 w-8 text-emerald-500" />,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    label: 'Approved & Verified',
    desc: 'Your profile is active. Accept patient care bookings below!',
  },
  REJECTED: {
    icon: <XCircle className="h-8 w-8 text-red-500" />,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    label: 'Rejected',
    desc: 'Application was not approved.',
  },
};

export default function MobileNurseDashboard() {
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
    <div className="space-y-6 px-3 pt-2 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground font-outfit text-2xl font-bold">
            Welcome,{' '}
            <span className="text-primary">{user?.fullName?.split(' ')[0] || 'Nurse Keshav'}</span>{' '}
            👋
          </h1>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {isOnline ? (
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Online — searching for care requests...
              </span>
            ) : (
              'Offline — go online to receive requests.'
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <OnlineStatusToggle isOnline={isOnline} onChange={setIsOnline} />
          <Link href="/nurse/appointments">
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 h-10 gap-1.5 rounded-xl px-3.5 font-semibold shadow-md"
            >
              <Calendar className="h-4 w-4" /> ({pendingRequests.length + acceptedVisits.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid (2x2) */}
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            title: 'Pending Requests',
            val: pendingRequests.length,
            desc: 'Awaiting action',
            icon: AlertCircle,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            href: '/nurse/appointments',
          },
          {
            title: "Today's Earnings",
            val: `₹${summary.todayEarnings}`,
            desc: 'Direct deposit',
            icon: TrendingUp,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            href: '/nurse/earnings',
          },
          {
            title: 'Active Shifts',
            val: acceptedVisits.length + inProgressVisits.length,
            desc: 'To complete',
            icon: Stethoscope,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            href: '/nurse/appointments',
          },
          {
            title: 'Week Balance',
            val: `₹${summary.weekEarnings}`,
            desc: 'Verified rewards',
            icon: DollarSign,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            href: '/nurse/earnings',
          },
        ].map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
          >
            <Link
              href={item.href}
              className="bg-card border-border/80 hover:border-primary/50 block rounded-2xl border p-4 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[10px] font-bold uppercase">
                  {item.title}
                </span>
                <div className={`rounded-lg p-1.5 ${item.bg}`}>
                  <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                </div>
              </div>
              <div className="text-foreground font-outfit mt-2 text-lg font-black">{item.val}</div>
              <p className="text-muted-foreground mt-0.5 text-[10px]">{item.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Active Visit Banner (Mobile) */}
      {inProgressVisits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="via-card to-card space-y-3 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/20 p-5 shadow-lg shadow-emerald-500/5"
        >
          <div className="flex items-center gap-3">
            <div className="shrink-0 animate-pulse rounded-xl bg-emerald-500 p-2.5 text-white">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
                Visit In Progress
              </span>
              <h3 className="text-foreground mt-1 text-sm font-bold">
                {inProgressVisits[0].patientName} •{' '}
                <span className="text-emerald-400">{inProgressVisits[0].serviceName}</span>
              </h3>
            </div>
          </div>
          <Link href="/nurse/appointments" className="block">
            <Button className="h-10 w-full gap-2 rounded-xl bg-emerald-500 text-xs font-bold text-white hover:bg-emerald-600">
              Log Report & Complete Shift <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Live Widget: Incoming Booking Requests (Mobile) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-foreground flex items-center gap-1.5 text-base font-bold">
            <Clock className="h-4 w-4 text-amber-400" /> Incoming Requests ({pendingRequests.length}
            )
          </h3>
          <Link href="/nurse/appointments" className="text-primary text-xs font-semibold">
            See All →
          </Link>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-muted-foreground bg-muted/20 border-border/60 rounded-2xl border border-dashed py-6 text-center">
            <CheckCircle className="mx-auto mb-1.5 h-6 w-6 text-emerald-400 opacity-80" />
            <p className="text-xs font-medium">No pending appointment requests.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((apt) => (
              <div
                key={apt.publicId}
                className="bg-card border-border/80 space-y-3 rounded-2xl border p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-foreground text-sm font-bold">{apt.patientName}</h4>
                    <span className="bg-primary/10 text-primary mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold">
                      {apt.serviceName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground block text-[10px]">Payout</span>
                    <span className="font-outfit text-base font-black text-emerald-400">
                      ₹{apt.payoutAmount}
                    </span>
                  </div>
                </div>

                <div className="text-muted-foreground space-y-1 text-xs">
                  <p className="text-foreground flex items-center gap-1.5 font-medium">
                    <Clock className="text-primary h-3 w-3" /> {apt.date} ({apt.timeSlot})
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px]">
                    <MapPin className="h-3 w-3 text-red-400" /> {apt.location.address} (
                    {apt.location.distanceKm} km away)
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedRequest(apt)}
                    className="border-primary/30 text-primary h-9 rounded-xl text-xs"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => acceptAppointment(apt.publicId)}
                    className="h-9 flex-1 gap-1 rounded-xl bg-emerald-500 text-xs font-semibold text-white hover:bg-emerald-600"
                  >
                    <Check className="h-3.5 w-3.5" /> Accept Shift
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectAppointment(apt.publicId, 'Schedule conflict')}
                    className="h-9 flex-1 rounded-xl border-red-500/30 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    <X className="h-3.5 w-3.5" /> Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accepted Visits with Start / Cancel */}
      {acceptedVisits.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-foreground flex items-center gap-1.5 px-1 text-base font-bold">
            <Stethoscope className="h-4 w-4 text-blue-400" /> Confirmed Visits (
            {acceptedVisits.length})
          </h3>
          <div className="space-y-3">
            {acceptedVisits.map((apt) => (
              <div
                key={apt.publicId}
                className="bg-card border-l-primary border-border/80 space-y-3 rounded-2xl border border-l-4 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-foreground text-sm font-bold">{apt.patientName}</h4>
                    <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-semibold">
                      {apt.serviceName}
                    </span>
                  </div>
                  <span className="text-primary bg-primary/10 rounded-md px-2 py-1 text-xs font-bold">
                    {apt.timeSlot}
                  </span>
                </div>
                <div className="text-muted-foreground space-y-1 text-xs">
                  <p className="text-foreground flex items-center gap-1.5 font-medium">
                    <Calendar className="text-primary h-3 w-3" /> {apt.date}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-red-400" /> {apt.location.address}
                  </p>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 shadow-primary/20 h-10 flex-1 gap-1.5 rounded-xl text-xs font-semibold text-white shadow-md"
                    onClick={() => handleStartVisit(apt)}
                  >
                    <Navigation className="h-3.5 w-3.5" /> Start Visit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-10 rounded-xl border-rose-200 text-xs text-rose-500 hover:bg-rose-50"
                    onClick={() => setCancelVisitId(apt.publicId)}
                  >
                    <X className="h-3.5 w-3.5" /> Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Navigation List */}
      <div className="space-y-2 pt-2">
        <h3 className="text-foreground px-1 text-base font-bold">Clinical Menu</h3>
        <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-sm">
          {[
            {
              title: 'Appointments & Shifts',
              icon: Calendar,
              href: '/nurse/appointments',
              bg: 'bg-primary/10',
              color: 'text-primary',
            },
            {
              title: 'Patient Messages',
              icon: MessageSquare,
              href: '/nurse/messages',
              bg: 'bg-blue-500/10',
              color: 'text-blue-500',
            },
            {
              title: 'Earnings & Payouts',
              icon: DollarSign,
              href: '/nurse/earnings',
              bg: 'bg-emerald-500/10',
              color: 'text-emerald-500',
            },
            {
              title: 'Weekly Availability',
              icon: Clock,
              href: '/nurse/availability',
              bg: 'bg-amber-500/10',
              color: 'text-amber-500',
            },
            {
              title: 'Edit Profile',
              icon: User,
              href: '/nurse/profile',
              bg: 'bg-blue-500/10',
              color: 'text-blue-500',
            },
          ].map((item, idx, arr) => (
            <Link
              key={item.title}
              href={item.href}
              className={`active:bg-muted flex items-center justify-between p-4 transition-colors ${idx !== arr.length - 1 ? 'border-border/50 border-b' : ''}`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`rounded-xl p-2 ${item.bg} ${item.color}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-foreground text-sm font-semibold">{item.title}</span>
              </div>
              <ChevronRight className="text-muted-foreground h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>

      {/* --- OVERLAYS --- */}

      {/* Visit Execution Overlay */}
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
