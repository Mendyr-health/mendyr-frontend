"use client";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Clock, Heart, Bell, ChevronRight, Activity, Calendar } from "lucide-react";
import Link from "next/link";

export default function MobilePatientDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm text-muted-foreground">Good Morning,</p>
        <h1 className="text-2xl font-bold text-foreground">
          {user?.fullName?.split(" ")[0] || "there"}
        </h1>
      </motion.div>

      {/* Main Action Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-primary/10 border border-primary/20 rounded-3xl p-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Heart className="w-24 h-24 text-primary" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider">{user?.status?.replace(/_/g, " ") || "Waitlisted"}</span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">Coming Soon</h2>
          <p className="text-sm text-muted-foreground max-w-[85%]">
            We are bringing premium healthcare directly to your home. You will be notified once services are available in your area.
          </p>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/patient/profile" className="flex flex-col items-center justify-center gap-2 bg-card border border-border rounded-2xl p-4 active:scale-95 transition-transform">
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-foreground">My Health</span>
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link href="/services" className="flex flex-col items-center justify-center gap-2 bg-card border border-border rounded-2xl p-4 active:scale-95 transition-transform">
            <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-foreground">Services</span>
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
          <h3 className="text-lg font-semibold text-foreground">Updates</h3>
          <button className="text-sm text-primary">View all</button>
        </div>
        
        <div className="space-y-3">
          <Link href="/patient/settings" className="flex items-center justify-between bg-card border border-border p-4 rounded-2xl active:bg-muted transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-amber-500/10 p-2 rounded-full text-amber-500">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Waitlist Status Update</p>
                <p className="text-xs text-muted-foreground">You are currently on our priority list.</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
          
          <div className="flex items-center justify-between bg-card border border-border p-4 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="bg-muted p-2 rounded-full text-muted-foreground">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Profile Completed</p>
                <p className="text-xs text-muted-foreground">Your information is secure.</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">Just now</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
