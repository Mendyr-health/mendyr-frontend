'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { User, Phone, MapPin, Mail, Camera, Save, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function MobilePatientProfile() {
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

  return (
    <div className="pb-24">
      {/* Header Profile Info (Avatar) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col items-center justify-center py-6"
      >
        <div className="relative mb-4">
          <div className="bg-primary/10 border-background flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 shadow-lg">
            <User className="text-primary h-10 w-10" />
          </div>
          {editing && (
            <button className="bg-primary text-primary-foreground absolute right-0 bottom-0 rounded-full p-2 shadow-md transition-transform active:scale-95">
              <Camera className="h-4 w-4" />
            </button>
          )}
        </div>
        <h2 className="text-foreground text-xl font-bold">{user?.fullName || 'Loading...'}</h2>
        <span className="text-primary mt-1 text-sm font-medium">Patient</span>
      </motion.div>

      {/* Profile Details (Cards) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 px-2"
      >
        <div className="mb-2 flex items-center justify-between px-2">
          <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
            Personal Info
          </h3>
          <button
            onClick={() => (editing ? setEditing(false) : startEditing())}
            className="text-primary text-sm font-medium active:opacity-70"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="bg-card border-border overflow-hidden rounded-3xl border shadow-sm">
          {/* Full Name */}
          <div className="border-border/50 border-b p-4">
            <label className="text-muted-foreground mb-1 block text-xs font-medium">
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-background border-border text-foreground focus:ring-primary/50 w-full rounded-xl border px-3 py-2 text-base focus:ring-2 focus:outline-none"
              />
            ) : (
              <div className="text-foreground flex items-center gap-3">
                <User className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">{user?.fullName || '—'}</span>
              </div>
            )}
          </div>

          {/* Email (read-only typically, or editable) */}
          <div className="border-border/50 border-b p-4">
            <label className="text-muted-foreground mb-1 block text-xs font-medium">Email</label>
            <div className="text-foreground flex items-center gap-3">
              <Mail className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">{user?.email || '—'}</span>
            </div>
          </div>

          {/* Phone */}
          <div className="border-border/50 border-b p-4">
            <label className="text-muted-foreground mb-1 block text-xs font-medium">Phone</label>
            {editing ? (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-background border-border text-foreground focus:ring-primary/50 w-full rounded-xl border px-3 py-2 text-base focus:ring-2 focus:outline-none"
              />
            ) : (
              <div className="text-foreground flex items-center gap-3">
                <Phone className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">{user?.phone || 'Not provided'}</span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="p-4">
            <label className="text-muted-foreground mb-1 block text-xs font-medium">Location</label>
            <div className="text-foreground flex items-center gap-3">
              <MapPin className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">India</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sticky Save Button (only visible when editing) */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed right-0 bottom-[72px] left-0 z-40 p-4"
          >
            <div className="flex gap-3">
              <button
                onClick={() => setEditing(false)}
                disabled={saving}
                className="bg-muted text-foreground flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 font-medium transition-transform active:scale-95 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary text-primary-foreground flex flex-[2] items-center justify-center gap-2 rounded-2xl py-3.5 font-medium shadow-lg transition-transform active:scale-95 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                Save Changes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
