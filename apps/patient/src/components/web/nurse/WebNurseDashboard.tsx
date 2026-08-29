"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useAppointments } from "@/features/nurse/useAppointments";
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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@mendyr/shared-ui/src/ui/button";
import dynamic from "next/dynamic";

const VisitExecutionOverlay = dynamic(() => import("@/components/nurse/VisitExecutionOverlay"));
const CancelVisitModal = dynamic(() => import("@/components/nurse/CancelVisitModal"));
const RequestDetailModal = dynamic(() => import("@/components/nurse/RequestDetailModal"));
const OnlineStatusToggle = dynamic(() => import("@/components/nurse/OnlineStatusToggle"));

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string; desc: string }> = {
  PENDING: { icon: <Clock className="h-6 w-6 text-amber-400" />, color: "amber", label: "Pending Review", desc: "Your application has been submitted and is awaiting review by our team." },
  UNDER_REVIEW: { icon: <AlertCircle className="h-6 w-6 text-blue-400" />, color: "blue", label: "Under Review", desc: "An admin is currently reviewing your credentials and documents." },
  APPROVED: { icon: <CheckCircle className="h-6 w-6 text-emerald-400" />, color: "emerald", label: "Approved & Verified", desc: "Congratulations! Your profile is active. You can now accept patient care bookings below." },
  REJECTED: { icon: <XCircle className="h-6 w-6 text-red-400" />, color: "red", label: "Rejected", desc: "Unfortunately, your application was not approved. Please check the rejection reason and reapply." },
};

export default function WebNurseDashboard() {
  const { user } = useAuth();
  const { pendingRequests, acceptedVisits, inProgressVisits, acceptAppointment, rejectAppointment, cancelVisit, startVisit, completeVisit, getEarningsSummary } = useAppointments();
  const summary = getEarningsSummary();

  // Interactive overlay state
  const [isOnline, setIsOnline] = useState(true);
  const [executionVisit, setExecutionVisit] = useState<any>(null);
  const [cancelVisitId, setCancelVisitId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const status: string = user?.status || "APPROVED";
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-foreground font-outfit">
              Welcome back, <span className="text-primary">{user?.fullName?.split(" ")[0] || "Nurse Keshav"}</span> 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              {isOnline ? (
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" /></span>
                  Searching for nearby requests...
                </span>
              ) : (
                <span className="flex items-center gap-2 text-muted-foreground">
                  Offline. Go online to receive requests.
                </span>
              )}
            </p>
          </div>
          <div className="shrink-0 mt-1">
            <OnlineStatusToggle isOnline={isOnline} onChange={setIsOnline} />
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[
          { title: "Pending", val: pendingRequests.length, desc: "Awaiting", icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20", href: "/nurse/appointments" },
          { title: "Active", val: acceptedVisits.length + inProgressVisits.length, desc: "Scheduled", icon: Stethoscope, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", href: "/nurse/appointments" },
          { title: "Today's Earnings", val: `₹${summary.todayEarnings.toLocaleString("en-IN")}`, desc: "Direct deposit balance", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", href: "/nurse/earnings", colSpan: "col-span-2 lg:col-span-1" },
        ].map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={item.colSpan || "col-span-1"}
          >
            <Link href={item.href} className="block bg-glass rounded-2xl p-4 sm:p-5 border border-border hover:border-primary/50 transition-all group h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.title}</span>
                <div className={`p-1.5 sm:p-2 rounded-xl border ${item.bg}`}>
                  <item.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${item.color}`} />
                </div>
              </div>
              <div className="mt-2 sm:mt-3">
                <div className="text-xl sm:text-2xl font-black text-foreground font-outfit group-hover:text-primary transition-colors">{item.val}</div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{item.desc}</p>
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
          className="bg-gradient-to-r from-emerald-500/20 via-glass to-glass rounded-2xl p-6 border border-emerald-500/40 shadow-xl shadow-emerald-500/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500 text-white animate-bounce shrink-0">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 uppercase tracking-wide">
                  Visit In Progress
                </span>
                <span className="text-xs text-muted-foreground">Started at {inProgressVisits[0].checkInTime}</span>
              </div>
              <h2 className="text-lg font-bold text-foreground mt-1">
                Currently caring for {inProgressVisits[0].patientName} — <span className="text-emerald-400">{inProgressVisits[0].serviceName}</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {inProgressVisits[0].location.address}, {inProgressVisits[0].location.city}
              </p>
            </div>
          </div>
          <Link href="/nurse/appointments">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-2 rounded-xl px-6 h-11 shrink-0">
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
        className="bg-glass rounded-2xl p-6 md:p-8 border border-border"
      >
        <div className="flex items-center justify-between gap-4 mb-2">
          <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-amber-400 shrink-0" />
            <span className="truncate">Incoming Requests ({pendingRequests.length})</span>
          </h3>
          <Link href="/nurse/appointments" className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0">
            View All <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mb-5">Accept requests quickly to confirm shifts and lock in payouts.</p>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/60">
            <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-medium">No pending appointment requests right now.</p>
            <p className="text-xs text-muted-foreground mt-0.5">You are all caught up! New patient bookings will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((apt) => (
              <div
                key={apt.publicId}
                className="bg-card rounded-xl p-5 border border-border hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-foreground text-base">{apt.patientName}</h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold mt-1 inline-block">
                        {apt.serviceName}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground block">Payout</span>
                      <span className="text-lg font-black text-emerald-400 font-outfit">₹{apt.payoutAmount}</span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5 text-foreground font-medium">
                      <Clock className="h-3.5 w-3.5 text-primary" /> {apt.date} • {apt.timeSlot}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-red-400" /> {apt.location.address} ({apt.location.distanceKm} km away)
                    </p>
                  </div>

                  {apt.specialInstructions && (
                    <div className="mt-3 p-2.5 rounded-lg bg-muted/40 text-[11px] text-muted-foreground border border-border/50 line-clamp-2">
                      <strong className="text-foreground">Note:</strong> {apt.specialInstructions}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-3 border-t border-border/60">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedRequest(apt)}
                    className="border-primary/30 text-primary hover:bg-primary/5 text-xs h-9 w-full sm:w-auto"
                  >
                    <Info className="h-3.5 w-3.5 mr-1" /> Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => acceptAppointment(apt.publicId)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold gap-1 flex-1 text-xs h-9 w-full sm:w-auto"
                  >
                    <Check className="h-3.5 w-3.5" /> Accept Shift
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectAppointment(apt.publicId, "Schedule conflict")}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs h-9 w-full sm:w-auto"
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
          className="bg-glass rounded-2xl p-6 md:p-8 border border-border"
        >
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
            <Stethoscope className="h-5 w-5 text-blue-400" /> Confirmed Visits ({acceptedVisits.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {acceptedVisits.map((apt) => (
              <div
                key={apt.publicId}
                className="bg-card rounded-xl p-5 border-l-4 border-l-primary border border-border hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-foreground">{apt.patientName}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                      {apt.serviceName}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                    {apt.timeSlot}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="flex items-center gap-1.5 font-medium text-foreground">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> {apt.date}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-red-400" /> {apt.location.address}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-border/60">
                  <Button
                    size="sm"
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold gap-1.5 text-xs h-9 shadow-md shadow-primary/20 w-full"
                    onClick={() => handleStartVisit(apt)}
                  >
                    <Navigation className="h-3.5 w-3.5" /> Start Visit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-rose-200 text-rose-500 hover:bg-rose-50 text-xs h-9 w-full sm:w-auto"
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
        onComplete={(publicId) => completeVisit(publicId, "Visit completed successfully")}
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
        onDecline={(id) => rejectAppointment(id, "Schedule conflict")}
      />
    </div>
  );
}
