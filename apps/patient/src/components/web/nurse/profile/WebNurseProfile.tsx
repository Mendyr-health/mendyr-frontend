'use client';

import { motion } from 'framer-motion';
import {
  User,
  Phone,
  MapPin,
  Mail,
  Briefcase,
  Award,
  Heart,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import { Input } from '@mendyr/shared-ui/src/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { toast } from 'sonner';

export default function WebNurseProfile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const startEditing = () => {
    setFullName(user?.fullName || '');
    setPhone(user?.phone || '');
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ fullName, phone });
      toast.success('Profile updated.');
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // Experience/qualifications/certifications below are display-only for now — they live on
  // the professional's KYC profile, not the user record `updateProfile` writes to.
  const personalFields = [
    {
      key: 'fullName',
      label: 'Full Name',
      icon: User,
      display: user?.fullName,
      editValue: fullName,
      setEditValue: setFullName,
    },
    { key: 'email', label: 'Email Address', icon: Mail, display: user?.email, editValue: null },
    {
      key: 'phone',
      label: 'Phone Number',
      icon: Phone,
      display: user?.phone || 'Not set',
      editValue: phone,
      setEditValue: setPhone,
    },
    { key: 'location', label: 'Location', icon: MapPin, display: 'India', editValue: null },
  ];

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
        className="bg-glass border-border max-w-3xl rounded-2xl border p-6 md:p-8"
      >
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="from-primary to-primary-light text-primary-foreground flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br shadow-lg">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-foreground text-xl font-bold">{user?.fullName || 'Nurse'}</h2>
              <span className="mt-1.5 inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500">
                Verified Nurse
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (editing ? setEditing(false) : startEditing())}
            className="h-10 w-full shrink-0 rounded-xl px-4 sm:w-auto"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {personalFields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                {field.label}
              </label>
              {editing && field.setEditValue ? (
                <Input
                  value={field.editValue || ''}
                  onChange={(e) => field.setEditValue!(e.target.value)}
                  className="bg-muted/50 border-border h-11 rounded-xl"
                />
              ) : (
                <div className="text-foreground bg-muted/30 border-border/50 flex min-h-[44px] items-center gap-3 rounded-xl border p-3 text-sm font-medium">
                  <field.icon className="text-primary h-4 w-4 shrink-0 opacity-80" />
                  <span className="truncate">{field.display || '—'}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <div className="border-border/60 mt-8 flex justify-end border-t pt-6">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-primary-foreground shadow-primary/20 h-11 rounded-xl px-6 font-semibold shadow-md transition-transform hover:scale-[1.02]"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </motion.div>

      {/* Professional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-glass border-border max-w-3xl rounded-2xl border p-6 md:p-8"
      >
        <h3 className="text-foreground mb-6 flex items-center gap-2.5 text-lg font-bold">
          <Briefcase className="text-primary h-5 w-5" />
          Professional Information
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Experience
            </label>
            {editing ? (
              <Input
                placeholder="e.g. 5 years in critical care"
                className="bg-muted/50 border-border h-11 rounded-xl"
              />
            ) : (
              <div className="text-foreground bg-muted/30 border-border/50 flex min-h-[44px] items-center rounded-xl border p-3 text-sm font-medium">
                Not set
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Qualifications
            </label>
            {editing ? (
              <Input
                placeholder="e.g. B.Sc Nursing, GNM"
                className="bg-muted/50 border-border h-11 rounded-xl"
              />
            ) : (
              <div className="text-foreground bg-muted/30 border-border/50 flex min-h-[44px] items-center rounded-xl border p-3 text-sm font-medium">
                Not set
              </div>
            )}
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Certifications
            </label>
            {editing ? (
              <Input
                placeholder="e.g. BLS, ACLS"
                className="bg-muted/50 border-border h-11 rounded-xl"
              />
            ) : (
              <div className="text-foreground bg-muted/30 border-border/50 flex min-h-[44px] items-center rounded-xl border p-3 text-sm font-medium">
                Not set
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Status & Documents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-glass border-border max-w-3xl rounded-2xl border p-6 md:p-8"
      >
        <h3 className="text-foreground mb-6 flex items-center gap-2.5 text-lg font-bold">
          <Award className="text-primary h-5 w-5" />
          Status & Documents
        </h3>

        <div className="space-y-8">
          <div className="flex items-start gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 sm:items-center">
            <div className="mt-0.5 shrink-0 rounded-full bg-emerald-500/20 p-2.5 sm:mt-0">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-foreground text-base font-bold">Approved & Verified</h4>
              <p className="mt-0.5 text-sm text-emerald-600/90">
                Your profile is active. You can accept patient care bookings.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Uploaded Documents
            </h4>
            <div className="space-y-3">
              {[
                { name: 'Nursing License', status: 'Verified', date: 'Oct 12, 2025' },
                { name: 'Aadhaar Card', status: 'Verified', date: 'Oct 12, 2025' },
                { name: 'Degree Certificate', status: 'Verified', date: 'Oct 12, 2025' },
              ].map((doc) => (
                <div
                  key={doc.name}
                  className="bg-muted/30 border-border/50 hover:border-primary/30 flex items-center justify-between rounded-2xl border p-4 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary shadow-primary/10 shrink-0 rounded-xl p-3 shadow-sm">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-bold">{doc.name}</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">Uploaded on {doc.date}</p>
                    </div>
                  </div>
                  <span className="rounded-lg border border-emerald-500/10 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500 shadow-sm">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>

            {editing && (
              <Button
                variant="outline"
                className="hover:bg-muted mt-4 h-12 w-full rounded-2xl border-2 border-dashed bg-transparent"
              >
                + Upload New Document
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
