'use client';

import { motion } from 'framer-motion';
import { User, Phone, MapPin, Mail, Briefcase, Award, Heart } from 'lucide-react';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import { Input } from '@mendyr/shared-ui/src/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

export default function WebNurseProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-8 pt-8 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-foreground font-outfit text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your professional information.</p>
      </motion.div>

      {/* Personal Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-glass border-border max-w-2xl rounded-2xl border p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="from-primary to-primary-light text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-foreground font-semibold">{user?.fullName || 'Nurse'}</h2>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-500">
                Nurse
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
            {editing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { label: 'Full Name', icon: User, value: user?.fullName },
            { label: 'Email', icon: Mail, value: user?.email },
            { label: 'Phone', icon: Phone, value: user?.phone || 'Not set' },
            { label: 'Location', icon: MapPin, value: 'India' },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-muted-foreground mb-1 block text-xs">{field.label}</label>
              {editing && field.label !== 'Email' ? (
                <Input defaultValue={field.value || ''} />
              ) : (
                <div className="text-foreground flex items-center gap-2 text-sm">
                  <field.icon className="text-muted-foreground h-4 w-4" />
                  {field.value || '—'}
                </div>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <div className="border-border mt-4 flex gap-3 border-t pt-4">
            <Button size="sm">Save Changes</Button>
          </div>
        )}
      </motion.div>

      {/* Professional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-glass border-border max-w-2xl rounded-2xl border p-6"
      >
        <h3 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
          <Briefcase className="text-primary h-5 w-5" />
          Professional Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-muted-foreground mb-1 block text-xs">Experience</label>
            {editing ? (
              <Input placeholder="e.g. 5 years in critical care" />
            ) : (
              <p className="text-foreground text-sm">Not set</p>
            )}
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-xs">Qualifications</label>
            {editing ? (
              <Input placeholder="e.g. B.Sc Nursing, GNM" />
            ) : (
              <p className="text-foreground text-sm">Not set</p>
            )}
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-xs">Certifications</label>
            {editing ? (
              <Input placeholder="e.g. BLS, ACLS" />
            ) : (
              <p className="text-foreground text-sm">Not set</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
