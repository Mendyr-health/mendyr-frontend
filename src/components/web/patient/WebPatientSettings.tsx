"use client";
import { motion } from "framer-motion";
import { Bell, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WebPatientSettings() {
  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-neutral-100 font-outfit">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences.</p>
      </motion.div>

      {/* Notifications */}
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
          {["Service launch updates", "Promotional offers", "Account alerts"].map(
            (item) => (
              <label key={item} className="flex items-center justify-between py-2 cursor-pointer group">
                <span className="text-sm text-muted-foreground group-hover:text-muted-foreground">
                  {item}
                </span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded accent-primary"
                />
              </label>
            )
          )}
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-glass rounded-2xl p-6 border border-border max-w-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-5 w-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-muted-foreground">Change Password</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Current Password</label>
            <Input type="password" placeholder="Enter current password" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">New Password</label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Confirm Password</label>
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
        className="bg-glass rounded-2xl p-6 border border-border max-w-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-muted-foreground">Support</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Need help? Contact our support team at{" "}
          <a href="mailto:support@mendyr.app" className="text-primary-light hover:underline">
            support@mendyr.app
          </a>
        </p>
      </motion.div>
    </div>
  );
}
