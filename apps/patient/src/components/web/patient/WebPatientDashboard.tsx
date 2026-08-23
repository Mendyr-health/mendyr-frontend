"use client";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Clock, Heart, Bell, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WebPatientDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-100 font-outfit">
          Welcome back, <span className="text-gradient">{user?.fullName?.split(" ")[0] || "there"}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your dashboard overview.</p>
      </motion.div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-glass rounded-2xl p-6 md:p-8 border border-border"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10">
            <Clock className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-muted-foreground">
              Services Launching Soon
            </h2>
            <p className="text-muted-foreground mt-1 max-w-lg">
              We&apos;re working hard to bring healthcare services to your area.
              You&apos;re on our waitlist and will be among the first to know when we launch.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/5 border border-primary">
          <div className="h-2 w-2 rounded-full bg-primary-light animate-pulse" />
          <span className="text-sm text-primary-light">
            Registration Status: <strong className="text-primary-light">{user?.status?.replace(/_/g, " ") || "Waitlisted"}</strong>
          </span>
        </div>
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Your Profile", desc: "View and edit your personal information", icon: Heart, href: "/patient/profile", color: "teal" },
          { title: "Notifications", desc: "Stay updated on new services and launches", icon: Bell, href: "/patient/settings", color: "amber" },
          { title: "Browse Services", desc: "Explore our upcoming healthcare services", icon: ArrowRight, href: "/services", color: "emerald" },
        ].map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
          >
            <Link
              href={card.href}
              className="block bg-glass rounded-xl p-5 border border-border hover:border-primary transition-all group"
            >
              <card.icon className={`h-5 w-5 text-${card.color}-400 mb-3`} />
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
