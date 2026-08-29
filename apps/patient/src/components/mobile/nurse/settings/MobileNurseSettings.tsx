'use client';

import { motion } from 'framer-motion';
import { Bell, Lock, Shield, Smartphone, Mail, Settings2 } from 'lucide-react';
import { useState } from 'react';

export default function MobileNurseSettings() {
  const [contactMethod, setContactMethod] = useState('Email');

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="px-2">
        <h1 className="text-foreground text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage preferences & security</p>
      </div>

      {/* Notifications Section */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-2">
        <h3 className="text-muted-foreground mb-3 flex items-center gap-2 px-2 text-sm font-bold tracking-wider uppercase">
          <Bell className="h-4 w-4" /> Notifications
        </h3>
        <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-sm">
          {[
            { label: 'Status updates', desc: 'Verification & account status' },
            { label: 'Patient requests', desc: 'New bookings & assignments' },
            { label: 'Schedule reminders', desc: 'Upcoming shifts & meetings' },
          ].map((item, idx, arr) => (
            <div
              key={item.label}
              className={`flex items-center justify-between p-4 ${idx !== arr.length - 1 ? 'border-border/50 border-b' : ''}`}
            >
              <div>
                <span className="text-foreground block text-sm font-semibold">{item.label}</span>
                <span className="text-muted-foreground text-xs">{item.desc}</span>
              </div>
              {/* Native-style iOS toggle switch implementation */}
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" defaultChecked className="peer text-foreground sr-only" />
                <div className="bg-muted peer peer-checked:bg-primary h-6 w-11 rounded-full peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-2"
      >
        <h3 className="text-muted-foreground mb-3 flex items-center gap-2 px-2 text-sm font-bold tracking-wider uppercase">
          <Shield className="h-4 w-4 text-amber-500" /> Preferences
        </h3>
        <div className="bg-card border-border overflow-hidden rounded-3xl border p-1 shadow-sm">
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'Email', icon: Mail },
              { id: 'Phone', icon: Smartphone },
              { id: 'WhatsApp', icon: Settings2 },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setContactMethod(method.id)}
                className={`flex flex-col items-center justify-center gap-2 rounded-2xl py-4 transition-colors ${
                  contactMethod === method.id
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <method.icon className="h-5 w-5" />
                <span className="text-xs font-semibold">{method.id}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-2"
      >
        <h3 className="text-muted-foreground mb-3 flex items-center gap-2 px-2 text-sm font-bold tracking-wider uppercase">
          <Lock className="h-4 w-4 text-red-500" /> Security
        </h3>
        <div className="bg-card border-border space-y-4 overflow-hidden rounded-3xl border p-4 shadow-sm">
          <input
            type="password"
            placeholder="Current Password"
            className="bg-muted/50 border-border w-full rounded-xl border px-4 py-3 text-base focus:border-red-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="New Password"
            className="bg-muted/50 border-border w-full rounded-xl border px-4 py-3 text-base focus:border-red-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="bg-muted/50 border-border w-full rounded-xl border px-4 py-3 text-base focus:border-red-500 focus:outline-none"
          />
          <button className="w-full rounded-xl bg-red-500/10 py-3.5 text-sm font-bold text-red-500 transition-transform active:scale-95">
            Update Password
          </button>
        </div>
      </motion.div>
    </div>
  );
}
