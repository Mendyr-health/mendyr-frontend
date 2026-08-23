"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, ClipboardList, Mail, TrendingUp, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";

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

export default function WebAdminDashboard() {
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/v1/admin/dashboard");
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

  const statCards = [
    { label: "Total Patients", value: stats.totalPatients, icon: Users, color: "var(--color-primary)", href: "/admin/patients" },
    { label: "Total Nurses", value: stats.totalNurses, icon: UserCheck, color: "var(--color-primary-light)", href: "/admin/nurses" },
    { label: "Pending Verifications", value: stats.pendingVerifications, icon: Activity, color: "var(--color-accent)", href: "/admin/nurses?status=PENDING" },
    { label: "Waitlist Entries", value: stats.waitlistCount, icon: ClipboardList, color: "hsl(260,60%,55%)", href: "/admin/waitlist" },
    { label: "New Contacts", value: stats.newContacts, icon: Mail, color: "hsl(340,65%,55%)", href: "/admin/contacts" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-outfit)]">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of Mendyr operations</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span>Pre-launch Phase</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link href={card.href} className="block group">
                <div className="bg-glass rounded-xl p-5 hover:glow-primary transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: card.color }} />
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {loading ? <span className="skeleton w-12 h-7 inline-block" /> : card.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-glass rounded-xl p-6">
          <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Review nurse applications", href: "/admin/nurses?status=PENDING", icon: UserCheck },
              { label: "View new contact inquiries", href: "/admin/contacts?status=NEW", icon: Mail },
              { label: "Export waitlist data", href: "/admin/waitlist", icon: ClipboardList },
              { label: "Manage services", href: "/admin/services", icon: Activity },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  href={action.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-sm text-muted-foreground hover:text-foreground group"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="flex-1">{action.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-glass rounded-xl p-6">
          <h2 className="font-semibold text-foreground mb-4">Platform Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Launch Status</span>
              <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">Pre-Launch</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Services</span>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">6 Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">API Health</span>
              <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
