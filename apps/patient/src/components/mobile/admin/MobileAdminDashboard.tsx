"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, ClipboardList, Mail, ArrowRight, Activity, ChevronRight } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";

interface Stats {
  totalPatients: number;
  totalNurses: number;
  pendingVerifications: number;
  waitlistCount: number;
  newContacts: number;
}

const defaultStats: Stats = {
  totalPatients: 0,
  totalNurses: 0,
  pendingVerifications: 0,
  waitlistCount: 0,
  newContacts: 0,
};

export default function MobileAdminDashboard() {
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await apiFetch("/api/v1/admin/dashboard");
        const data = await res.json();
        if (data.success) setStats(data.data);
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="pb-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Overview</h1>
          <p className="text-sm text-muted-foreground">Operations at a glance</p>
        </div>
        <div className="px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary uppercase">
          Pre-Launch
        </div>
      </motion.div>

      {/* Priority Action (Pending Verifications) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
      >
        <Link href="/admin/nurses?status=PENDING" className="block bg-accent text-accent-foreground rounded-3xl p-5 shadow-lg active:scale-[0.98] transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
              <Activity className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5" />
          </div>
          <p className="text-3xl font-bold mb-1">
            {loading ? "-" : stats.pendingVerifications}
          </p>
          <p className="text-sm font-medium opacity-90">Pending Verifications</p>
        </Link>
      </motion.div>

      {/* Horizontal Scrollable Stat Cards */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.2 }}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar -mx-4 px-4"
      >
        {[
          { label: "Waitlist", value: stats.waitlistCount, icon: ClipboardList, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Patients", value: stats.totalPatients, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Nurses", value: stats.totalNurses, icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Inquiries", value: stats.newContacts, icon: Mail, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((stat, idx) => (
          <div key={idx} className="shrink-0 w-36 bg-card border border-border rounded-3xl p-4 snap-start shadow-sm">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{loading ? "-" : stat.value}</p>
            <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions List */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-bold text-foreground mb-3">Quick Actions</h2>
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          {[
            { label: "Review Nurses", href: "/admin/nurses?status=PENDING", icon: UserCheck, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Contact Inquiries", href: "/admin/contacts?status=NEW", icon: Mail, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "Manage Services", href: "/admin/services", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          ].map((action, idx, arr) => (
            <Link
              key={idx}
              href={action.href}
              className={`flex items-center justify-between p-4 active:bg-muted transition-colors ${idx !== arr.length - 1 ? 'border-b border-border/50' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl ${action.bg} ${action.color}`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-foreground">{action.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
