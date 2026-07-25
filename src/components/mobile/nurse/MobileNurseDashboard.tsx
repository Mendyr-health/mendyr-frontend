"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Clock, CheckCircle, XCircle, AlertCircle, FileText, User, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string; desc: string; bg: string }> = {
  PENDING: { icon: <Clock className="h-8 w-8 text-amber-500" />, color: "text-amber-500", bg: "bg-amber-500/10", label: "Pending Review", desc: "Your application is awaiting review." },
  UNDER_REVIEW: { icon: <AlertCircle className="h-8 w-8 text-blue-500" />, color: "text-blue-500", bg: "bg-blue-500/10", label: "Under Review", desc: "An admin is reviewing your credentials." },
  APPROVED: { icon: <CheckCircle className="h-8 w-8 text-emerald-500" />, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Approved", desc: "Your profile has been verified!" },
  REJECTED: { icon: <XCircle className="h-8 w-8 text-red-500" />, color: "text-red-500", bg: "bg-red-500/10", label: "Rejected", desc: "Application was not approved." },
};

export default function MobileNurseDashboard() {
  const { user } = useAuth();
  const status: string = "PENDING";

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <div className="pb-24 space-y-6">
      {/* Header */}
      <div className="px-2">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome, {user?.fullName?.split(" ")[0] || "Nurse"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile & status</p>
      </div>

      {/* Hero Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mx-2 rounded-3xl p-6 ${config.bg} border border-border shadow-sm flex flex-col items-center text-center`}
      >
        <div className="mb-4">
          {config.icon}
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          {config.label}
        </h2>
        <p className={`text-sm ${config.color} font-medium`}>
          {config.desc}
        </p>
      </motion.div>

      {/* Progress Tracker (Horizontal) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-2"
      >
        <h3 className="text-lg font-bold text-foreground mb-4">Verification Steps</h3>
        <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2 z-0" />
            {[
              { label: "Submit", done: true },
              { label: "Docs", done: true },
              { label: "Review", done: status === "UNDER_REVIEW" || status === "APPROVED" },
              { label: "Done", done: status === "APPROVED" },
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-card ${step.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {step.done ? <CheckCircle className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />}
                </div>
                <span className={`text-[10px] font-semibold uppercase ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Menu List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-2"
      >
        <h3 className="text-lg font-bold text-foreground mb-3">Settings</h3>
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          {[
            { title: "Edit Profile", icon: User, href: "/nurse/profile", bg: "bg-blue-500/10", color: "text-blue-500" },
            { title: "Documents", icon: FileText, href: "/nurse/documents", bg: "bg-purple-500/10", color: "text-purple-500" },
            { title: "Availability", icon: Calendar, href: "/nurse/availability", bg: "bg-emerald-500/10", color: "text-emerald-500" },
          ].map((item, idx, arr) => (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center justify-between p-4 active:bg-muted transition-colors ${idx !== arr.length - 1 ? 'border-b border-border/50' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${item.bg} ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-foreground">{item.title}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
