'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Loader2, CheckCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

export default function WebSuperAdminSettings() {
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
    'w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-white/60 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm text-sm';

  return (
    <div className="max-w-3xl">
      <h1 className="text-foreground mb-6 flex items-center gap-3 font-[family-name:var(--font-outfit)] text-2xl font-bold">
        <Settings className="text-primary h-6 w-6" /> System Settings
      </h1>

      <div className="space-y-6">
        {/* General */}
        <div className="bg-glass rounded-xl p-6">
          <h2 className="text-foreground mb-4 font-semibold">General</h2>
          <div className="space-y-4">
            <div>
              <label className="text-muted-foreground mb-1.5 block text-sm">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-muted-foreground mb-1.5 block text-sm">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-muted-foreground mb-1.5 block text-sm">
                Target Launch Date
              </label>
              <input
                type="date"
                value={settings.launchDate}
                onChange={(e) => setSettings({ ...settings, launchDate: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-glass rounded-xl p-6">
          <h2 className="text-foreground mb-4 font-semibold">Security</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground mb-1.5 block text-sm">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings({ ...settings, maxLoginAttempts: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-muted-foreground mb-1.5 block text-sm">
                  Session Timeout (min)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="bg-glass rounded-xl p-6">
          <h2 className="text-foreground mb-4 font-semibold">Feature Flags</h2>
          <div className="space-y-4">
            {[
              {
                label: 'Maintenance Mode',
                key: 'maintenanceMode',
                desc: 'Take the site offline for maintenance',
              },
              {
                label: 'Patient Registration',
                key: 'registrationEnabled',
                desc: 'Allow new patient registrations',
              },
              {
                label: 'Nurse Registration',
                key: 'nurseRegistrationEnabled',
                desc: 'Allow new nurse applications',
              },
            ].map((flag) => (
              <div key={flag.key} className="flex items-center justify-between">
                <div>
                  <p className="text-foreground text-sm">{flag.label}</p>
                  <p className="text-muted-foreground text-xs">{flag.desc}</p>
                </div>
                <button
                  onClick={() =>
                    setSettings({ ...settings, [flag.key]: !(settings as any)[flag.key] })
                  }
                  className={`relative h-6 w-11 rounded-full transition-colors ${(settings as any)[flag.key] ? 'bg-primary' : 'bg-muted'}`}
                >
                  <div
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${(settings as any)[flag.key] ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-primary flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
