"use client";

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
  ChevronRight,
  DollarSign,
  TrendingUp,
  Stethoscope,
  MapPin,
  Check,
  X,
  Play,
  ArrowRight,
  Activity,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@mendyr/shared-ui/src/ui/button";

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string; desc: string; bg: string }> = {
  PENDING: { icon: <Clock className="h-8 w-8 text-amber-500" />, color: "text-amber-500", bg: "bg-amber-500/10", label: "Pending Review", desc: "Your application is awaiting review." },
  UNDER_REVIEW: { icon: <AlertCircle className="h-8 w-8 text-blue-500" />, color: "text-blue-500", bg: "bg-blue-500/10", label: "Under Review", desc: "An admin is reviewing your credentials." },
  APPROVED: { icon: <CheckCircle className="h-8 w-8 text-emerald-500" />, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Approved & Verified", desc: "Your profile is active. Accept patient care bookings below!" },
  REJECTED: { icon: <XCircle className="h-8 w-8 text-red-500" />, color: "text-red-500", bg: "bg-red-500/10", label: "Rejected", desc: "Application was not approved." },
};

export default function MobileNurseDashboard() {
  const { user } = useAuth();
  const { pendingRequests, acceptedVisits, inProgressVisits, acceptAppointment, rejectAppointment, startVisit, getEarningsSummary } = useAppointments();
  const summary = getEarningsSummary();

  const status: string = user?.status || "APPROVED";
  const config = statusConfig[status] || statusConfig.APPROVED;

  return (
    <div className="pb-28 space-y-6 px-3 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-outfit">
            Welcome, <span className="text-primary">{user?.fullName?.split(" ")[0] || "Nurse Keshav"}</span> 👋
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Mobile Clinical Dashboard</p>
        </div>
        <Link href="/nurse/appointments">
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 rounded-xl h-10 px-3.5 shadow-md shadow-primary/20">
            <Calendar className="h-4 w-4" /> ({pendingRequests.length + acceptedVisits.length})
          </Button>
        </Link>
      </div>

      {/* Hero Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl p-5 ${config.bg} border border-border shadow-sm flex items-center gap-4`}
      >
        <div className="shrink-0">{config.icon}</div>
        <div>
          <h2 className="text-base font-bold text-foreground">{config.label}</h2>
          <p className={`text-xs ${config.color} font-medium leading-relaxed`}>{config.desc}</p>
        </div>
      </motion.div>

      {/* Quick Stats Grid (2x2) */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { title: "Pending Requests", val: pendingRequests.length, desc: "Awaiting action", icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/10", href: "/nurse/appointments" },
          { title: "Today's Earnings", val: `₹${summary.todayEarnings}`, desc: "Direct deposit", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", href: "/nurse/earnings" },
          { title: "Active Shifts", val: acceptedVisits.length + inProgressVisits.length, desc: "To complete", icon: Stethoscope, color: "text-blue-400", bg: "bg-blue-500/10", href: "/nurse/appointments" },
          { title: "Week Balance", val: `₹${summary.weekEarnings}`, desc: "Verified rewards", icon: DollarSign, color: "text-purple-400", bg: "bg-purple-500/10", href: "/nurse/earnings" },
        ].map((item, idx) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
            <Link href={item.href} className="block bg-card rounded-2xl p-4 border border-border/80 hover:border-primary/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.title}</span>
                <div className={`p-1.5 rounded-lg ${item.bg}`}>
                  <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                </div>
              </div>
              <div className="mt-2 text-lg font-black text-foreground font-outfit">{item.val}</div>
              <p className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Active Visit Banner (Mobile) */}
      {inProgressVisits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-emerald-500/20 via-card to-card rounded-3xl p-5 border border-emerald-500/40 shadow-lg shadow-emerald-500/5 space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500 text-white animate-pulse shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 uppercase">
                Visit In Progress
              </span>
              <h3 className="text-sm font-bold text-foreground mt-1">
                {inProgressVisits[0].patientName} • <span className="text-emerald-400">{inProgressVisits[0].serviceName}</span>
              </h3>
            </div>
          </div>
          <Link href="/nurse/appointments" className="block">
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-2 rounded-xl h-10 text-xs">
              Log Report & Complete Shift <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Live Widget: Incoming Booking Requests (Mobile) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-amber-400" /> Incoming Requests ({pendingRequests.length})
          </h3>
          <Link href="/nurse/appointments" className="text-xs font-semibold text-primary">
            See All →
          </Link>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border/60">
            <CheckCircle className="h-6 w-6 text-emerald-400 mx-auto mb-1.5 opacity-80" />
            <p className="text-xs font-medium">No pending appointment requests.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((apt) => (
              <div key={apt.publicId} className="bg-card rounded-2xl p-4 border border-border/80 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{apt.patientName}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold mt-1 inline-block">
                      {apt.serviceName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground block">Payout</span>
                    <span className="text-base font-black text-emerald-400 font-outfit">₹{apt.payoutAmount}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5 text-foreground font-medium">
                    <Clock className="h-3 w-3 text-primary" /> {apt.date} ({apt.timeSlot})
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px]">
                    <MapPin className="h-3 w-3 text-red-400" /> {apt.location.address} ({apt.location.distanceKm} km away)
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={() => acceptAppointment(apt.publicId)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold gap-1 flex-1 text-xs h-9 rounded-xl"
                  >
                    <Check className="h-3.5 w-3.5" /> Accept Shift
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectAppointment(apt.publicId, "Schedule conflict")}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 flex-1 text-xs h-9 rounded-xl"
                  >
                    <X className="h-3.5 w-3.5" /> Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu Navigation List */}
      <div className="space-y-2 pt-2">
        <h3 className="text-base font-bold text-foreground px-1">Clinical Menu</h3>
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          {[
            { title: "Appointments & Shifts", icon: Calendar, href: "/nurse/appointments", bg: "bg-primary/10", color: "text-primary" },
            { title: "Patient Messages", icon: MessageSquare, href: "/nurse/messages", bg: "bg-blue-500/10", color: "text-blue-500" },
            { title: "Earnings & Payouts", icon: DollarSign, href: "/nurse/earnings", bg: "bg-emerald-500/10", color: "text-emerald-500" },
            { title: "Weekly Availability", icon: Clock, href: "/nurse/availability", bg: "bg-amber-500/10", color: "text-amber-500" },
            { title: "Documents & Credentials", icon: FileText, href: "/nurse/documents", bg: "bg-purple-500/10", color: "text-purple-500" },
            { title: "Edit Profile", icon: User, href: "/nurse/profile", bg: "bg-blue-500/10", color: "text-blue-500" },
          ].map((item, idx, arr) => (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center justify-between p-4 active:bg-muted transition-colors ${idx !== arr.length - 1 ? "border-b border-border/50" : ""}`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2 rounded-xl ${item.bg} ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-foreground text-sm">{item.title}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
