'use client';
import { motion } from 'framer-motion';
import { Bell, Lock, Shield } from 'lucide-react';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import { Input } from '@mendyr/shared-ui/src/ui/input';

export default function WebPatientSettings() {
  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-outfit text-2xl font-bold text-neutral-100">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences.</p>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-glass border-border max-w-2xl rounded-2xl border p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <Bell className="text-primary-light h-5 w-5" />
          <h2 className="text-muted-foreground text-lg font-semibold">Notifications</h2>
        </div>
        <div className="space-y-3">
          {['Service launch updates', 'Promotional offers', 'Account alerts'].map((item) => (
            <label
              key={item}
              className="group flex cursor-pointer items-center justify-between py-2"
            >
              <span className="text-muted-foreground group-hover:text-muted-foreground text-sm">
                {item}
              </span>
              <input type="checkbox" defaultChecked className="accent-primary h-4 w-4 rounded" />
            </label>
          ))}
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-glass border-border max-w-2xl rounded-2xl border p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <Lock className="h-5 w-5 text-amber-400" />
          <h2 className="text-muted-foreground text-lg font-semibold">Change Password</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-muted-foreground mb-1 block text-xs">Current Password</label>
            <Input type="password" placeholder="Enter current password" />
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-xs">New Password</label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-xs">Confirm Password</label>
            <Input type="password" placeholder="Confirm new password" />
          </div>
          <Button size="sm">Update Password</Button>
        </div>
      </motion.div>

      {/* Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-glass border-border max-w-2xl rounded-2xl border p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <Shield className="h-5 w-5 text-emerald-400" />
          <h2 className="text-muted-foreground text-lg font-semibold">Support</h2>
        </div>
        <p className="text-muted-foreground mb-3 text-sm">
          Need help? Contact our support team at{' '}
          <a href="mailto:support@mendyr.app" className="text-primary-light hover:underline">
            support@mendyr.app
          </a>
        </p>
      </motion.div>
    </div>
  );
}
