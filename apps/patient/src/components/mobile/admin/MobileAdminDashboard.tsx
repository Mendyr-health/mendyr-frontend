'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  ClipboardList,
  Mail,
  ArrowRight,
  Activity,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api-client';

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
        const res = await apiFetch('/api/v1/admin/dashboard');
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
    <div className="space-y-6 pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="text-foreground text-2xl font-bold">Overview</h1>
          <p className="text-muted-foreground text-sm">Operations at a glance</p>
        </div>
        <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold uppercase">
          Pre-Launch
        </div>
      </motion.div>

      {/* Priority Action (Pending Verifications) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link
          href="/admin/nurses?status=PENDING"
          className="bg-accent text-accent-foreground block rounded-3xl p-5 shadow-lg transition-transform active:scale-[0.98]"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
              <Activity className="h-6 w-6" />
            </div>
            <ArrowRight className="h-5 w-5" />
          </div>
          <p className="mb-1 text-3xl font-bold">{loading ? '-' : stats.pendingVerifications}</p>
          <p className="text-sm font-medium opacity-90">Pending Verifications</p>
        </Link>
      </motion.div>

      {/* Horizontal Scrollable Stat Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="hide-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4"
      >
        {[
          {
            label: 'Waitlist',
            value: stats.waitlistCount,
            icon: ClipboardList,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
          },
          {
            label: 'Patients',
            value: stats.totalPatients,
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
          },
          {
            label: 'Nurses',
            value: stats.totalNurses,
            icon: UserCheck,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
          },
          {
            label: 'Inquiries',
            value: stats.newContacts,
            icon: Mail,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-card border-border w-36 shrink-0 snap-start rounded-3xl border p-4 shadow-sm"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-foreground mb-1 text-2xl font-bold">{loading ? '-' : stat.value}</p>
            <p className="text-muted-foreground text-xs font-medium">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-foreground mb-3 text-lg font-bold">Quick Actions</h2>
        <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-sm">
          {[
            {
              label: 'Review Nurses',
              href: '/admin/nurses?status=PENDING',
              icon: UserCheck,
              color: 'text-blue-500',
              bg: 'bg-blue-500/10',
            },
            {
              label: 'Contact Inquiries',
              href: '/admin/contacts?status=NEW',
              icon: Mail,
              color: 'text-amber-500',
              bg: 'bg-amber-500/10',
            },
            {
              label: 'Manage Services',
              href: '/admin/services',
              icon: Activity,
              color: 'text-emerald-500',
              bg: 'bg-emerald-500/10',
            },
          ].map((action, idx, arr) => (
            <Link
              key={idx}
              href={action.href}
              className={`active:bg-muted flex items-center justify-between p-4 transition-colors ${idx !== arr.length - 1 ? 'border-border/50 border-b' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-xl p-2 ${action.bg} ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-foreground font-medium">{action.label}</span>
              </div>
              <ChevronRight className="text-muted-foreground h-5 w-5" />
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
