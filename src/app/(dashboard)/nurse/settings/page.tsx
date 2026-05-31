"use client";
import { motion } from "framer-motion";
import { Bell, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NurseSettingsPage() {
  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-neutral-100 font-outfit">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and notifications.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-glass rounded-2xl p-6 border border-border max-w-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-5 w-5 text-primary-light" />
          <h2 className="text-lg font-semibold text-muted-foreground">Notifications</h2>
        </div>
        <div className="space-y-3">
          {["Verification status updates", "New patient requests", "Schedule reminders", "Platform announcements"].map((item) => (
            <label key={item} className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-sm text-muted-foreground">{item}</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary rounded" />
            </label>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-glass rounded-2xl p-6 border border-border max-w-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-muted-foreground">Contact Preferences</h2>
        </div>
        <div className="space-y-3">
          {["Email", "Phone", "WhatsApp"].map((method) => (
            <label key={method} className="flex items-center gap-3 py-2 cursor-pointer">
              <input type="radio" name="contact" className="accent-primary" defaultChecked={method === "Email"} />
              <span className="text-sm text-muted-foreground">{method}</span>
            </label>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-glass rounded-2xl p-6 border border-border max-w-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-5 w-5 text-red-400" />
          <h2 className="text-lg font-semibold text-muted-foreground">Change Password</h2>
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
