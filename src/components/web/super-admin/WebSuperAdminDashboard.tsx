"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, UserCheck, Shield, ClipboardList, Mail, FileText, ArrowRight, Settings, Activity } from "lucide-react";

export default function WebSuperAdminDashboard() {
  const [stats, setStats] = useState({ totalPatients: 0, totalNurses: 0, totalAdmins: 0, pendingVerifications: 0, waitlistCount: 0, newContacts: 0, totalAuditLogs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/v1/admin/dashboard");
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

  const statCards = [
    { label: "Patients", value: stats.totalPatients, icon: Users, color: "var(--color-primary)", href: "/admin/patients" },
    { label: "Nurses", value: stats.totalNurses, icon: UserCheck, color: "var(--color-primary-light)", href: "/admin/nurses" },
    { label: "Admins", value: stats.totalAdmins, icon: Shield, color: "hsl(260,60%,55%)", href: "/super-admin/admins" },
    { label: "Pending", value: stats.pendingVerifications, icon: Activity, color: "var(--color-accent)", href: "/admin/nurses?status=PENDING" },
    { label: "Waitlist", value: stats.waitlistCount, icon: ClipboardList, color: "hsl(200,65%,50%)", href: "/admin/waitlist" },
    { label: "Contacts", value: stats.newContacts, icon: Mail, color: "hsl(340,65%,55%)", href: "/admin/contacts" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-outfit)]">Super Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Full system overview and management</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <Link href={card.href} className="block group">
                <div className="bg-glass rounded-xl p-4 hover:glow-primary transition-all text-center">
                  <div className="w-10 h-10 rounded-lg mx-auto flex items-center justify-center mb-2" style={{ backgroundColor: `${card.color}15` }}>
                    <Icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  <p className="text-xl font-bold text-foreground">{loading ? "—" : card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-glass rounded-xl p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Admin Management</h2>
          <div className="space-y-2">
            {[
              { label: "Manage Admins", href: "/super-admin/admins" },
              { label: "Manage Roles", href: "/super-admin/roles" },
              { label: "Manage Permissions", href: "/super-admin/permissions" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted text-sm text-muted-foreground hover:text-foreground group">
                <span>{item.label}</span><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-glass rounded-xl p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Audit & Security</h2>
          <div className="space-y-2">
            {[
              { label: "View Audit Logs", href: "/super-admin/audit-logs" },
              { label: "System Settings", href: "/super-admin/settings" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted text-sm text-muted-foreground hover:text-foreground group">
                <span>{item.label}</span><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-glass rounded-xl p-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Settings className="w-4 h-4 text-primary" /> System Status</h2>
          <div className="space-y-3">
            {[
              { label: "Database", status: "Healthy", color: "var(--color-success)" },
              { label: "Redis Cache", status: "Healthy", color: "var(--color-success)" },
              { label: "Email Service", status: "Configured", color: "var(--color-primary)" },
              { label: "Storage", status: "Connected", color: "var(--color-primary)" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: item.color, backgroundColor: `${item.color}15` }}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
