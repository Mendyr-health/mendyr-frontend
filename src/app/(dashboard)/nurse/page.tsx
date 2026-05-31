"use client";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Clock, CheckCircle, XCircle, AlertCircle, FileText, User, Calendar } from "lucide-react";
import Link from "next/link";

const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string; desc: string }> = {
  PENDING: { icon: <Clock className="h-6 w-6" />, color: "amber", label: "Pending Review", desc: "Your application has been submitted and is awaiting review by our team." },
  UNDER_REVIEW: { icon: <AlertCircle className="h-6 w-6" />, color: "blue", label: "Under Review", desc: "An admin is currently reviewing your credentials and documents." },
  APPROVED: { icon: <CheckCircle className="h-6 w-6" />, color: "emerald", label: "Approved", desc: "Congratulations! Your profile has been verified. You'll be notified when services go live." },
  REJECTED: { icon: <XCircle className="h-6 w-6" />, color: "red", label: "Rejected", desc: "Unfortunately, your application was not approved. Please check the rejection reason and reapply." },
};

export default function NurseDashboard() {
  const { user } = useAuth();
  const status: string = "PENDING"; // Would come from API

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-100 font-outfit">
          Welcome, <span className="text-gradient">{user?.fullName?.split(" ")[0] || "Nurse"}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Manage your nursing profile and application status.</p>
      </motion.div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`bg-glass rounded-2xl p-6 md:p-8 border border-${config.color}-500/20`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl bg-${config.color}-500/10 text-${config.color}-400`}>
            {config.icon}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-muted-foreground">
              Application Status: <span className={`text-${config.color}-400`}>{config.label}</span>
            </h2>
            <p className="text-muted-foreground mt-1">{config.desc}</p>
          </div>
        </div>
      </motion.div>

      {/* Status Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-glass rounded-2xl p-6 border border-border"
      >
        <h3 className="font-semibold text-muted-foreground mb-6">Verification Timeline</h3>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-muted" />
          {[
            { label: "Application Submitted", done: true },
            { label: "Documents Uploaded", done: true },
            { label: "Under Review", done: status === "UNDER_REVIEW" || status === "APPROVED" },
            { label: "Verification Complete", done: status === "APPROVED" },
          ].map((step, idx) => (
            <div key={idx} className="relative flex items-center gap-4 pb-6 last:pb-0">
              <div className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center ${step.done ? "bg-primary/20 text-primary-light" : "bg-muted text-neutral-600"}`}>
                {step.done ? <CheckCircle className="h-5 w-5" /> : <div className="h-3 w-3 rounded-full bg-neutral-700" />}
              </div>
              <span className={`text-sm ${step.done ? "text-muted-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Edit Profile", desc: "Update your professional info", icon: User, href: "/nurse/profile" },
          { title: "Documents", desc: "Upload and manage your documents", icon: FileText, href: "/nurse/documents" },
          { title: "Availability", desc: "Set your weekly schedule", icon: Calendar, href: "/nurse/availability" },
        ].map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
          >
            <Link
              href={card.href}
              className="block bg-glass rounded-xl p-5 border border-border hover:border-primary transition-all group"
            >
              <card.icon className="h-5 w-5 text-primary-light mb-3" />
              <h3 className="font-semibold text-muted-foreground group-hover:text-primary-light transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{card.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
