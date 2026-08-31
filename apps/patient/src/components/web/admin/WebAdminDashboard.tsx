'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  ClipboardList,
  Mail,
  TrendingUp,
  ArrowRight,
  Activity,
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

export default function WebAdminDashboard() {
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

  const statCards = [
    {
      label: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'var(--color-primary)',
      href: '/admin/patients',
    },
    {
      label: 'Total Nurses',
      value: stats.totalNurses,
      icon: UserCheck,
      color: 'var(--color-primary-light)',
      href: '/admin/nurses',
    },
    {
      label: 'Pending Verifications',
      value: stats.pendingVerifications,
      icon: Activity,
      color: 'var(--color-accent)',
      href: '/admin/nurses?status=PENDING',
    },
    {
      label: 'Waitlist Entries',
      value: stats.waitlistCount,
      icon: ClipboardList,
      color: 'hsl(260,60%,55%)',
      href: '/admin/waitlist',
    },
    {
      label: 'New Contacts',
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
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Overview of Mendyr operations</p>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <TrendingUp className="text-primary h-4 w-4" />
          <span>Pre-launch Phase</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
                <div className="bg-glass hover:glow-primary rounded-xl p-5 transition-all">
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: card.color }} />
                    </div>
                    <ArrowRight className="text-muted-foreground h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </div>
                  <p className="text-foreground text-2xl font-bold">
                    {loading ? <span className="skeleton inline-block h-7 w-12" /> : card.value}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">{card.label}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-glass rounded-xl p-6">
          <h2 className="text-foreground mb-4 font-semibold">Quick Actions</h2>
          <div className="space-y-2">
            {[
              {
                label: 'Review nurse applications',
                href: '/admin/nurses?status=PENDING',
                icon: UserCheck,
              },
              {
                label: 'View new contact inquiries',
                href: '/admin/contacts?status=NEW',
                icon: Mail,
              },
              { label: 'Export waitlist data', href: '/admin/waitlist', icon: ClipboardList },
              { label: 'Manage services', href: '/admin/services', icon: Activity },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  href={action.href}
                  className="hover:bg-muted text-muted-foreground hover:text-foreground group flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors"
                >
                  <Icon className="text-primary h-4 w-4" />
                  <span className="flex-1">{action.label}</span>
                  <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-glass rounded-xl p-6">
          <h2 className="text-foreground mb-4 font-semibold">Platform Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Launch Status</span>
              <span className="bg-accent/10 text-accent rounded-full px-2 py-1 text-xs">
                Pre-Launch
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Services</span>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
                6 Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">API Health</span>
              <span className="bg-success/10 text-success rounded-full px-2 py-1 text-xs">
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
