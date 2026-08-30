'use client';

import { motion } from 'framer-motion';
import {
  User,
  Phone,
  MapPin,
  Mail,
  Briefcase,
  Award,
  Check,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import { Input } from '@mendyr/shared-ui/src/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

export default function MobileNurseProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <h1 className="text-foreground text-2xl font-bold">Profile</h1>
        <button
          onClick={() => setEditing(!editing)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${editing ? 'bg-muted text-foreground' : 'bg-primary/10 text-primary'}`}
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Avatar Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center pt-2"
      >
        <div className="relative">
          <div className="from-primary to-primary-light text-primary-foreground flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr text-3xl font-bold shadow-lg">
            {user?.fullName?.charAt(0) || 'N'}
          </div>
          <div className="border-background absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-emerald-500">
            <Check className="h-3 w-3 text-white" />
          </div>
        </div>
        <h2 className="text-foreground mt-4 text-xl font-bold">{user?.fullName || 'Nurse'}</h2>
        <p className="mt-1 text-sm font-medium text-emerald-500">Verified Nurse</p>
      </motion.div>

      {/* Personal Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-2"
      >
        <h3 className="text-muted-foreground mb-3 px-2 text-sm font-bold tracking-wider uppercase">
          Personal Information
        </h3>
        <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-sm">
          {[
            { label: 'Email', icon: Mail, value: user?.email, editable: false },
            {
              label: 'Phone',
              icon: Phone,
              value: user?.phone || '',
              editable: true,
              placeholder: 'Enter phone number',
            },
            {
              label: 'Location',
              icon: MapPin,
              value: 'India',
              editable: true,
              placeholder: 'Enter location',
            },
          ].map((field, idx, arr) => (
            <div
              key={field.label}
              className={`flex flex-col gap-1 p-4 ${idx !== arr.length - 1 ? 'border-border/50 border-b' : ''}`}
            >
              <div className="text-muted-foreground mb-1 flex items-center gap-2">
                <field.icon className="h-4 w-4" />
                <span className="text-xs font-semibold">{field.label}</span>
              </div>
              {editing && field.editable ? (
                <input
                  type="text"
                  defaultValue={field.value}
                  placeholder={field.placeholder}
                  className="bg-muted/50 border-border focus:border-primary w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                />
              ) : (
                <p
                  className={`text-sm font-medium ${field.value ? 'text-foreground' : 'text-muted-foreground italic'}`}
                >
                  {field.value || 'Not provided'}
                </p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Professional Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-2"
      >
        <h3 className="text-muted-foreground mb-3 flex items-center gap-2 px-2 text-sm font-bold tracking-wider uppercase">
          <Briefcase className="h-4 w-4" /> Professional Info
        </h3>
        <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-sm">
          {[
            { label: 'Experience', placeholder: 'e.g. 5 years in critical care' },
            { label: 'Qualifications', placeholder: 'e.g. B.Sc Nursing, GNM' },
            { label: 'Certifications', placeholder: 'e.g. BLS, ACLS' },
          ].map((field, idx, arr) => (
            <div
              key={field.label}
              className={`flex flex-col gap-1 p-4 ${idx !== arr.length - 1 ? 'border-border/50 border-b' : ''}`}
            >
              <span className="text-muted-foreground mb-1 text-xs font-semibold">
                {field.label}
              </span>
              {editing ? (
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="bg-muted/50 border-border focus:border-primary w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                />
              ) : (
                <p className="text-muted-foreground text-sm italic">Not provided</p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Status & Documents Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-2"
      >
        <h3 className="text-muted-foreground mb-3 flex items-center gap-2 px-2 text-sm font-bold tracking-wider uppercase">
          <Award className="h-4 w-4" /> Status & Documents
        </h3>
        <div className="bg-card border-border space-y-4 overflow-hidden rounded-3xl border p-4 shadow-sm">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <CheckCircle className="h-6 w-6 shrink-0 text-emerald-500" />
            <div>
              <h4 className="text-foreground text-sm font-semibold">Approved & Verified</h4>
              <p className="mt-0.5 text-xs text-emerald-600/80">Profile is active and ready.</p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { name: 'Nursing License', status: 'Verified' },
              { name: 'Aadhaar Card', status: 'Verified' },
              { name: 'Degree Certificate', status: 'Verified' },
            ].map((doc) => (
              <div
                key={doc.name}
                className="bg-muted/50 border-border flex items-center justify-between rounded-xl border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary rounded-lg p-2">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-foreground text-sm font-medium">{doc.name}</span>
                </div>
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500 uppercase">
                  {doc.status}
                </span>
              </div>
            ))}

            {editing && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full rounded-xl border-2 border-dashed"
              >
                + Upload Document
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Floating Save Button */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed right-4 bottom-20 left-4 z-40"
        >
          <button className="bg-primary text-primary-foreground shadow-primary/30 w-full rounded-2xl py-4 text-lg font-bold shadow-xl transition-transform active:scale-[0.98]">
            Save Changes
          </button>
        </motion.div>
      )}
    </div>
  );
}
