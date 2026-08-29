'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Loader2, CheckCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

export default function MobileSuperAdminSettings() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Mendyr',
    supportEmail: 'support@mendyr.app',
    launchDate: '',
    maintenanceMode: false,
    registrationEnabled: true,
    nurseRegistrationEnabled: true,
    maxLoginAttempts: '5',
    sessionTimeout: '15',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiFetch('/api/v1/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      /* */
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary';

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="px-2">
        <h1 className="text-foreground text-2xl font-bold">System Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Configure global platform options</p>
      </div>

      <div className="space-y-6 px-2">
        {/* General */}
        <div>
          <h3 className="text-muted-foreground mb-3 px-2 text-sm font-bold tracking-wider uppercase">
            General
          </h3>
          <div className="bg-card border-border space-y-4 rounded-3xl border p-4 shadow-sm">
            <div>
              <label className="text-muted-foreground mb-1.5 block text-xs font-semibold">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-muted-foreground mb-1.5 block text-xs font-semibold">
                Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div>
          <h3 className="text-muted-foreground mb-3 px-2 text-base font-bold tracking-wider uppercase">
            Feature Flags
          </h3>
          <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-sm">
            {[
              { label: 'Maintenance Mode', key: 'maintenanceMode', desc: 'Take the site offline' },
              { label: 'Patient Auth', key: 'registrationEnabled', desc: 'Allow patient signups' },
              {
                label: 'Nurse Auth',
                key: 'nurseRegistrationEnabled',
                desc: 'Allow nurse applications',
              },
            ].map((flag, idx, arr) => (
              <div
                key={flag.key}
                className={`flex items-center justify-between p-4 ${idx !== arr.length - 1 ? 'border-border/50 border-b' : ''}`}
              >
                <div>
                  <p className="text-foreground text-sm font-semibold">{flag.label}</p>
                  <p className="text-muted-foreground text-xs">{flag.desc}</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer text-foreground sr-only"
                    checked={(settings as any)[flag.key]}
                    onChange={() =>
                      setSettings({ ...settings, [flag.key]: !(settings as any)[flag.key] })
                    }
                  />
                  <div className="bg-muted peer peer-checked:bg-primary h-6 w-11 rounded-full peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
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
        className="fixed right-4 bottom-20 left-4 z-40"
      >
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-primary text-primary-foreground shadow-primary/30 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold shadow-xl transition-transform active:scale-[0.98] disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : saved ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </motion.div>
    </div>
  );
}
