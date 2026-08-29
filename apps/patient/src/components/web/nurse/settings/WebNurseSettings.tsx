'use client';
import { motion } from 'framer-motion';
import { Bell, Lock, Shield } from 'lucide-react';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import { Input } from '@mendyr/shared-ui/src/ui/input';

export default function WebNurseSettings() {
  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-foreground font-outfit text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and notifications.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-glass border-border max-w-2xl rounded-2xl border p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <Bell className="text-primary h-5 w-5" />
          <h2 className="text-foreground text-lg font-semibold">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            'Verification status updates',
            'New patient requests',
            'Schedule reminders',
            'Platform announcements',
          ].map((item) => (
            <label key={item} className="flex cursor-pointer items-center justify-between py-2">
              <span className="text-foreground text-sm">{item}</span>
              <input type="checkbox" defaultChecked className="accent-primary h-4 w-4 rounded" />
            </label>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-glass border-border max-w-2xl rounded-2xl border p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <Shield className="h-5 w-5 text-amber-500" />
          <h2 className="text-foreground text-lg font-semibold">Contact Preferences</h2>
        </div>
        <div className="space-y-3">
          {['Email', 'Phone', 'WhatsApp'].map((method) => (
            <label key={method} className="flex cursor-pointer items-center gap-3 py-2">
              <input
                type="radio"
                name="contact"
                className="accent-primary"
                defaultChecked={method === 'Email'}
              />
              <span className="text-foreground text-sm">{method}</span>
            </label>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-glass border-border max-w-2xl rounded-2xl border p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <Lock className="h-5 w-5 text-red-500" />
          <h2 className="text-foreground text-lg font-semibold">Change Password</h2>
        </div>
        <div className="space-y-4">
          <Input type="password" placeholder="Current password" />
          <Input type="password" placeholder="New password" />
          <Input type="password" placeholder="Confirm password" />
          <Button size="sm">Update Password</Button>
        </div>
      </motion.div>
    </div>
  );
}
