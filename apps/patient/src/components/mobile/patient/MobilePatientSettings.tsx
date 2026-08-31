'use client';
import { motion } from 'framer-motion';
import { Bell, Lock, Shield, ChevronRight, HelpCircle, LogOut } from 'lucide-react';
import { useState } from 'react';
import { ReferralCard } from '@/components/patient/ReferralCard';

// Mobile Toggle Switch Primitive
function MobileToggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function MobilePatientSettings() {
  const [notifications, setNotifications] = useState({
    launches: true,
    promos: true,
    alerts: true,
  });

  return (
    <div className="space-y-6 pb-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-2">
        <h1 className="text-foreground text-2xl font-bold">Settings</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="px-2"
      >
        <ReferralCard />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-2 px-4">
          <h2 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
            Preferences
          </h2>
        </div>
        <div className="bg-card border-border mx-2 overflow-hidden rounded-3xl border shadow-sm">
          <div className="border-border/50 flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-full p-2">
                <Bell className="h-4 w-4" />
              </div>
              <span className="text-foreground text-sm font-medium">Service Launches</span>
            </div>
            <MobileToggle
              checked={notifications.launches}
              onChange={() => setNotifications((prev) => ({ ...prev, launches: !prev.launches }))}
            />
          </div>

          <div className="border-border/50 flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-500">
                <Bell className="h-4 w-4" />
              </div>
              <span className="text-foreground text-sm font-medium">Promotional Offers</span>
            </div>
            <MobileToggle
              checked={notifications.promos}
              onChange={() => setNotifications((prev) => ({ ...prev, promos: !prev.promos }))}
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-amber-500/10 p-2 text-amber-500">
                <Bell className="h-4 w-4" />
              </div>
              <span className="text-foreground text-sm font-medium">Account Alerts</span>
            </div>
            <MobileToggle
              checked={notifications.alerts}
              onChange={() => setNotifications((prev) => ({ ...prev, alerts: !prev.alerts }))}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-2 px-4">
          <h2 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
            Security
          </h2>
        </div>
        <div className="bg-card border-border mx-2 overflow-hidden rounded-3xl border shadow-sm">
          <button className="active:bg-muted flex w-full items-center justify-between p-4 transition-colors">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-500/10 p-2 text-blue-500">
                <Lock className="h-4 w-4" />
              </div>
              <span className="text-foreground text-sm font-medium">Change Password</span>
            </div>
            <ChevronRight className="text-muted-foreground h-5 w-5" />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-2 px-4">
          <h2 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
            Support
          </h2>
        </div>
        <div className="bg-card border-border mx-2 overflow-hidden rounded-3xl border shadow-sm">
          <a
            href="mailto:support@mendyr.app"
            className="active:bg-muted border-border/50 flex w-full items-center justify-between border-b p-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-rose-500/10 p-2 text-rose-500">
                <HelpCircle className="h-4 w-4" />
              </div>
              <span className="text-foreground text-sm font-medium">Contact Support</span>
            </div>
            <ChevronRight className="text-muted-foreground h-5 w-5" />
          </a>
          <div className="active:bg-muted flex w-full items-center justify-between p-4 transition-colors">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-slate-500/10 p-2 text-slate-500">
                <Shield className="h-4 w-4" />
              </div>
              <span className="text-foreground text-sm font-medium">Privacy Policy</span>
            </div>
            <ChevronRight className="text-muted-foreground h-5 w-5" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
