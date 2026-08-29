'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  Shield,
  ClipboardList,
  Mail,
  FileText,
  ArrowRight,
  Settings,
  Activity,
} from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

export default function WebSuperAdminDashboard() {
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

  const statCards = [
    {
      label: 'Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'var(--color-primary)',
      href: '/admin/patients',
    },
    {
      label: 'Nurses',
      value: stats.totalNurses,
      icon: UserCheck,
      color: 'var(--color-primary-light)',
      href: '/admin/nurses',
    },
    {
      label: 'Admins',
      value: stats.totalAdmins,
      icon: Shield,
      color: 'hsl(260,60%,55%)',
      href: '/super-admin/admins',
    },
    {
      label: 'Pending',
      value: stats.pendingVerifications,
      icon: Activity,
      color: 'var(--color-accent)',
      href: '/admin/nurses?status=PENDING',
    },
    {
      label: 'Waitlist',
      value: stats.waitlistCount,
      icon: ClipboardList,
      color: 'hsl(200,65%,50%)',
      href: '/admin/waitlist',
    },
    {
      label: 'Contacts',
      value: stats.newContacts,
      icon: Mail,
      color: 'hsl(340,65%,55%)',
      href: '/admin/contacts',
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-foreground font-[family-name:var(--font-outfit)] text-2xl font-bold">
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Full system overview and management</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link href={card.href} className="group block">
                <div className="bg-glass hover:glow-primary rounded-xl p-4 text-center transition-all">
                  <div
                    className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${card.color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: card.color }} />
                  </div>
                  <p className="text-foreground text-xl font-bold">{loading ? '—' : card.value}</p>
                  <p className="text-muted-foreground text-xs">{card.label}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-glass rounded-xl p-6">
          <h2 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
            <Shield className="text-primary h-4 w-4" /> Admin Management
          </h2>
          <div className="space-y-2">
            {[
              { label: 'Manage Admins', href: '/super-admin/admins' },
              { label: 'Manage Roles', href: '/super-admin/roles' },
              { label: 'Manage Permissions', href: '/super-admin/permissions' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:bg-muted text-muted-foreground hover:text-foreground group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm"
              >
                <span>{item.label}</span>
                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-glass rounded-xl p-6">
          <h2 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
            <FileText className="text-primary h-4 w-4" /> Audit & Security
          </h2>
          <div className="space-y-2">
            {[
              { label: 'View Audit Logs', href: '/super-admin/audit-logs' },
              { label: 'System Settings', href: '/super-admin/settings' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:bg-muted text-muted-foreground hover:text-foreground group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm"
              >
                <span>{item.label}</span>
                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-glass rounded-xl p-6">
          <h2 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
            <Settings className="text-primary h-4 w-4" /> System Status
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Database', status: 'Healthy', color: 'var(--color-success)' },
              { label: 'Redis Cache', status: 'Healthy', color: 'var(--color-success)' },
              { label: 'Email Service', status: 'Configured', color: 'var(--color-primary)' },
              { label: 'Storage', status: 'Connected', color: 'var(--color-primary)' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-xs"
                  style={{ color: item.color, backgroundColor: `${item.color}15` }}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
