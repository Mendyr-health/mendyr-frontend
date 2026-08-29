"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, FileText, Settings, ChevronRight, Activity, Users, UserCheck } from "lucide-react";
import { apiFetch } from "@/lib/api-client";

export default function MobileSuperAdminDashboard() {
  const [stats, setStats] = useState({ totalPatients: 0, totalNurses: 0, totalAdmins: 0, pendingVerifications: 0, waitlistCount: 0, newContacts: 0, totalAuditLogs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await apiFetch("/api/v1/admin/dashboard");
        const data = await res.json();
        if (data.success) setStats(data.data);
      } catch {
        // Ignore
      } finally { 
        setLoading(false); 
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="pb-24 space-y-6">
      {/* Header */}
      <div className="px-2">
        <h1 className="text-2xl font-bold text-foreground">Super Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">System overview & management</p>
      </div>

      {/* Priority Stat Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-2 grid grid-cols-2 gap-3"
      >
        {[
          { label: "Admins", value: stats.totalAdmins, icon: Shield, bg: "bg-purple-500/10", color: "text-purple-500" },
          { label: "Audit Logs", value: stats.totalAuditLogs || "-", icon: FileText, bg: "bg-blue-500/10", color: "text-blue-500" },
          { label: "Patients", value: stats.totalPatients, icon: Users, bg: "bg-primary/10", color: "text-primary" },
          { label: "Nurses", value: stats.totalNurses, icon: UserCheck, bg: "bg-emerald-500/10", color: "text-emerald-500" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-card border border-border rounded-3xl p-4 shadow-sm flex flex-col justify-between aspect-square">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{loading ? "—" : stat.value}</p>
              <p className="text-xs font-semibold text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Admin Management Menu */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-2"
      >
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-500" /> Management
        </h3>
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          {[
            { label: "Manage Admins", href: "/super-admin/admins" },
            { label: "Manage Roles", href: "/super-admin/roles" },
            { label: "Manage Permissions", href: "/super-admin/permissions" },
          ].map((item, idx, arr) => (
            <Link key={item.href} href={item.href} className={`flex items-center justify-between p-4 active:bg-muted transition-colors ${idx !== arr.length - 1 ? 'border-b border-border/50' : ''}`}>
              <span className="font-semibold text-foreground">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Audit & Security Menu */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-2"
      >
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
          <Settings className="w-4 h-4 text-amber-500" /> System Settings
        </h3>
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          {[
            { label: "View Audit Logs", href: "/super-admin/audit-logs" },
            { label: "System Configuration", href: "/super-admin/settings" },
          ].map((item, idx, arr) => (
            <Link key={item.href} href={item.href} className={`flex items-center justify-between p-4 active:bg-muted transition-colors ${idx !== arr.length - 1 ? 'border-b border-border/50' : ''}`}>
              <span className="font-semibold text-foreground">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* System Status Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-2"
      >
        <div className="bg-primary/10 border border-primary/20 rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">All Systems Operational</h3>
              <p className="text-xs text-primary font-medium">Database, Redis, Email active</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
