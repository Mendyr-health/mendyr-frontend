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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string; desc: string }> = {
  PENDING: { icon: <Clock className="h-6 w-6 text-amber-400" />, color: "amber", label: "Pending Review", desc: "Your application has been submitted and is awaiting review by our team." },
  UNDER_REVIEW: { icon: <AlertCircle className="h-6 w-6 text-blue-400" />, color: "blue", label: "Under Review", desc: "An admin is currently reviewing your credentials and documents." },
  APPROVED: { icon: <CheckCircle className="h-6 w-6 text-emerald-400" />, color: "emerald", label: "Approved & Verified", desc: "Congratulations! Your profile is active. You can now accept patient care bookings below." },
  REJECTED: { icon: <XCircle className="h-6 w-6 text-red-400" />, color: "red", label: "Rejected", desc: "Unfortunately, your application was not approved. Please check the rejection reason and reapply." },
};

export default function WebNurseDashboard() {
  const { user } = useAuth();
  const { pendingRequests, acceptedVisits, inProgressVisits, acceptAppointment, rejectAppointment, startVisit, getEarningsSummary } = useAppointments();
  const summary = getEarningsSummary();

  const status: string = user?.status || "APPROVED"; // Default to APPROVED for demo so nurse can test accepting appointments!
  const config = statusConfig[status] || statusConfig.APPROVED;

  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      {/* Welcome Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground font-outfit">
            Welcome back, <span className="text-primary">{user?.fullName?.split(" ")[0] || "Nurse Keshav"}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here is your live clinical dashboard and daily schedule.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/nurse/appointments">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 shadow-lg shadow-primary/20 rounded-xl h-11">
              <Calendar className="h-4 w-4" /> View All Appointments ({pendingRequests.length + acceptedVisits.length})
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Pending Requests", val: pendingRequests.length, desc: "Awaiting your acceptance", icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", href: "/nurse/appointments" },
          { title: "Today's Earnings", val: `₹${summary.todayEarnings.toLocaleString("en-IN")}`, desc: "Direct deposit balance", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", href: "/nurse/earnings" },
          { title: "Active / Scheduled", val: acceptedVisits.length + inProgressVisits.length, desc: "Shifts to complete today", icon: Stethoscope, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30", href: "/nurse/appointments" },
          { title: "Verification Status", val: config.label, desc: "Aadhaar & License check", icon: CheckCircle, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30", href: "/nurse/status" },
        ].map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link href={item.href} className="block bg-glass rounded-2xl p-5 border border-border hover:border-primary/50 transition-all group h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.title}</span>
                <div className={`p-2 rounded-xl border ${item.bg}`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xl md:text-2xl font-black text-foreground font-outfit group-hover:text-primary transition-colors">{item.val}</div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" /> Incoming Appointment Requests ({pendingRequests.length})
            </h3>
            <p className="text-sm text-muted-foreground">Accept requests quickly to confirm shifts and lock in payouts.</p>
          </div>
          <Link href="/nurse/appointments" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

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

                <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                  <Button
                    size="sm"
                    onClick={() => acceptAppointment(apt.publicId)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold gap-1 flex-1 text-xs h-9"
                  >
                    <Check className="h-3.5 w-3.5" /> Accept Shift
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectAppointment(apt.publicId, "Schedule conflict")}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 flex-1 text-xs h-9"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "Appointments & Shifts", desc: "Manage clinical schedule", icon: Calendar, href: "/nurse/appointments", color: "text-primary" },
          { title: "Patient Messages", desc: "Real-time care chat", icon: MessageSquare, href: "/nurse/messages", color: "text-blue-400" },
          { title: "Earnings & Payouts", desc: "View bank statements & rewards", icon: DollarSign, href: "/nurse/earnings", color: "text-emerald-400" },
          { title: "Weekly Availability", desc: "Set working days and hours", icon: Clock, href: "/nurse/availability", color: "text-amber-400" },
          { title: "Documents & Credentials", desc: "Upload license & nursing certificates", icon: FileText, href: "/nurse/documents", color: "text-purple-400" },
          { title: "Profile & Specialty", desc: "Update professional biography", icon: User, href: "/nurse/profile", color: "text-pink-400" },
        ].map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
          >
            <Link
              href={card.href}
              className="block bg-glass rounded-xl p-5 border border-border hover:border-primary transition-all group h-full flex flex-col justify-between"
            >
              <div>
                <card.icon className={`h-6 w-6 ${card.color} mb-3`} />
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-base">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{card.desc}</p>
              </div>
              <div className="mt-4 flex items-center text-xs font-semibold text-primary gap-1 group-hover:translate-x-1 transition-transform">
                Open <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
