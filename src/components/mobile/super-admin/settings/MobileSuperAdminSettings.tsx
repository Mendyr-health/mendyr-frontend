"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Loader2, CheckCircle } from "lucide-react";
import { apiFetch } from "@/lib/api-client";

export default function MobileSuperAdminSettings() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "Mendyr",
    supportEmail: "support@mendyr.app",
    launchDate: "",
    maintenanceMode: false,
    registrationEnabled: true,
    nurseRegistrationEnabled: true,
    maxLoginAttempts: "5",
    sessionTimeout: "15",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiFetch("/api/v1/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {/* */} finally { setLoading(false); }
  };

  const inputClass = "w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary";

  return (
    <div className="pb-28 space-y-6">
      {/* Header */}
      <div className="px-2">
        <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure global platform options</p>
      </div>

      <div className="px-2 space-y-6">
        {/* General */}
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">General</h3>
          <div className="bg-card border border-border rounded-3xl p-4 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Site Name</label>
              <input type="text" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Support Email</label>
              <input type="email" value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">Feature Flags</h3>
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            {[
              { label: "Maintenance Mode", key: "maintenanceMode", desc: "Take the site offline" },
              { label: "Patient Auth", key: "registrationEnabled", desc: "Allow patient signups" },
              { label: "Nurse Auth", key: "nurseRegistrationEnabled", desc: "Allow nurse applications" },
            ].map((flag, idx, arr) => (
              <div key={flag.key} className={`p-4 flex items-center justify-between ${idx !== arr.length - 1 ? 'border-b border-border/50' : ''}`}>
                <div>
                  <p className="text-sm font-semibold text-foreground">{flag.label}</p>
                  <p className="text-xs text-muted-foreground">{flag.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={(settings as any)[flag.key]}
                    onChange={() => setSettings({ ...settings, [flag.key]: !(settings as any)[flag.key] })}
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Save Button */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="fixed bottom-20 left-4 right-4 z-40"
      >
        <button 
          onClick={handleSave} 
          disabled={loading} 
          className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform text-lg disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : saved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {loading ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
      </motion.div>
    </div>
  );
}
