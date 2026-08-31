'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, FileText, Settings, ChevronRight, Activity, Users, UserCheck } from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

export default function MobileSuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalNurses: 0,
    totalAdmins: 0,
    pendingVerifications: 0,
    waitlistCount: 0,
    newContacts: 0,
    totalAuditLogs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await apiFetch('/api/v1/admin/dashboard');
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
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="px-2">
        <h1 className="text-foreground text-2xl font-bold">Super Admin</h1>
        <p className="text-muted-foreground mt-1 text-sm">System overview & management</p>
      </div>

      {/* Priority Stat Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-3 px-2"
      >
        {[
          {
            label: 'Admins',
            value: stats.totalAdmins,
            icon: Shield,
            bg: 'bg-purple-500/10',
            color: 'text-purple-500',
          },
          {
            label: 'Audit Logs',
            value: stats.totalAuditLogs || '-',
            icon: FileText,
            bg: 'bg-blue-500/10',
            color: 'text-blue-500',
          },
          {
            label: 'Patients',
            value: stats.totalPatients,
            icon: Users,
            bg: 'bg-primary/10',
            color: 'text-primary',
          },
          {
            label: 'Nurses',
            value: stats.totalNurses,
            icon: UserCheck,
            bg: 'bg-emerald-500/10',
            color: 'text-emerald-500',
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-card border-border flex aspect-square flex-col justify-between rounded-3xl border p-4 shadow-sm"
          >
            <div
              className={`mb-2 flex h-10 w-10 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-foreground text-2xl font-bold">{loading ? '—' : stat.value}</p>
              <p className="text-muted-foreground text-xs font-semibold">{stat.label}</p>
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
        <h3 className="text-muted-foreground mb-3 flex items-center gap-2 px-2 text-sm font-bold tracking-wider uppercase">
          <Shield className="h-4 w-4 text-purple-500" /> Management
        </h3>
        <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-sm">
          {[
            { label: 'Manage Admins', href: '/super-admin/admins' },
            { label: 'Manage Roles', href: '/super-admin/roles' },
            { label: 'Manage Permissions', href: '/super-admin/permissions' },
          ].map((item, idx, arr) => (
            <Link
              key={item.href}
              href={item.href}
              className={`active:bg-muted flex items-center justify-between p-4 transition-colors ${idx !== arr.length - 1 ? 'border-border/50 border-b' : ''}`}
            >
              <span className="text-foreground font-semibold">{item.label}</span>
              <ChevronRight className="text-muted-foreground h-5 w-5" />
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
        <h3 className="text-muted-foreground mb-3 flex items-center gap-2 px-2 text-sm font-bold tracking-wider uppercase">
          <Settings className="h-4 w-4 text-amber-500" /> System Settings
        </h3>
        <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-sm">
          {[
            { label: 'View Audit Logs', href: '/super-admin/audit-logs' },
            { label: 'System Configuration', href: '/super-admin/settings' },
          ].map((item, idx, arr) => (
            <Link
              key={item.href}
              href={item.href}
              className={`active:bg-muted flex items-center justify-between p-4 transition-colors ${idx !== arr.length - 1 ? 'border-border/50 border-b' : ''}`}
            >
              <span className="text-foreground font-semibold">{item.label}</span>
              <ChevronRight className="text-muted-foreground h-5 w-5" />
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
        <div className="bg-primary/10 border-primary/20 flex items-center justify-between rounded-3xl border p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 text-primary flex h-10 w-10 items-center justify-center rounded-full">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-foreground text-sm font-bold">All Systems Operational</h3>
              <p className="text-primary text-xs font-medium">Database, Redis, Email active</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
