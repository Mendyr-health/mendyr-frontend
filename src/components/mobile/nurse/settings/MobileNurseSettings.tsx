"use client";

import { motion } from "framer-motion";
import { Bell, Lock, Shield, Smartphone, Mail, Settings2 } from "lucide-react";
import { useState } from "react";

export default function MobileNurseSettings() {
  const [contactMethod, setContactMethod] = useState("Email");

  return (
    <div className="pb-24 space-y-6">
      {/* Header */}
      <div className="px-2">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage preferences & security</p>
      </div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-2"
      >
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
          <Bell className="w-4 h-4" /> Notifications
        </h3>
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          {[
            { label: "Status updates", desc: "Verification & account status" },
            { label: "Patient requests", desc: "New bookings & assignments" },
            { label: "Schedule reminders", desc: "Upcoming shifts & meetings" },
          ].map((item, idx, arr) => (
            <div key={item.label} className={`p-4 flex items-center justify-between ${idx !== arr.length - 1 ? 'border-b border-border/50' : ''}`}>
              <div>
                <span className="text-sm font-semibold text-foreground block">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.desc}</span>
              </div>
              {/* Native-style iOS toggle switch implementation */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
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
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-500" /> Preferences
        </h3>
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm p-1">
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: "Email", icon: Mail },
              { id: "Phone", icon: Smartphone },
              { id: "WhatsApp", icon: Settings2 },
            ].map(method => (
              <button
                key={method.id}
                onClick={() => setContactMethod(method.id)}
                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl transition-colors ${
                  contactMethod === method.id 
                    ? "bg-amber-500/10 text-amber-500" 
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <method.icon className="w-5 h-5" />
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
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
          <Lock className="w-4 h-4 text-red-500" /> Security
        </h3>
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm p-4 space-y-4">
          <input 
            type="password" 
            placeholder="Current Password" 
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
          />
          <input 
            type="password" 
            placeholder="New Password" 
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
          />
          <input 
            type="password" 
            placeholder="Confirm Password" 
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
          />
          <button className="w-full py-3.5 bg-red-500/10 text-red-500 font-bold rounded-xl active:scale-95 transition-transform text-sm">
            Update Password
          </button>
        </div>
      </motion.div>
    </div>
  );
}
