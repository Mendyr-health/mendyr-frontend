"use client";
import { motion } from "framer-motion";
import { Bell, Lock, Shield, ChevronRight, HelpCircle, LogOut } from "lucide-react";
import { useState } from "react";

// Mobile Toggle Switch Primitive
function MobileToggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? "bg-primary" : "bg-muted"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
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
    <div className="pb-24 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-2">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="px-4 mb-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Preferences</h2>
        </div>
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm mx-2">
          
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-foreground">Service Launches</span>
            </div>
            <MobileToggle 
              checked={notifications.launches} 
              onChange={() => setNotifications(prev => ({ ...prev, launches: !prev.launches }))} 
            />
          </div>

          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-500">
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-foreground">Promotional Offers</span>
            </div>
            <MobileToggle 
              checked={notifications.promos} 
              onChange={() => setNotifications(prev => ({ ...prev, promos: !prev.promos }))} 
            />
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-full text-amber-500">
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-foreground">Account Alerts</span>
            </div>
            <MobileToggle 
              checked={notifications.alerts} 
              onChange={() => setNotifications(prev => ({ ...prev, alerts: !prev.alerts }))} 
            />
          </div>

        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="px-4 mb-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Security</h2>
        </div>
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm mx-2">
          <button className="w-full flex items-center justify-between p-4 active:bg-muted transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-full text-blue-500">
                <Lock className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-foreground">Change Password</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="px-4 mb-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Support</h2>
        </div>
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm mx-2">
          <a href="mailto:support@mendyr.app" className="w-full flex items-center justify-between p-4 active:bg-muted transition-colors border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/10 rounded-full text-rose-500">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-foreground">Contact Support</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </a>
          <div className="w-full flex items-center justify-between p-4 active:bg-muted transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-500/10 rounded-full text-slate-500">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-foreground">Privacy Policy</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
