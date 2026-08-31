'use client';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { User, Phone, MapPin, Mail, Loader2 } from 'lucide-react';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import { Input } from '@mendyr/shared-ui/src/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

export default function WebPatientProfile() {
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
    <div className="space-y-8 pt-8 lg:pt-0">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-outfit text-2xl font-bold text-neutral-100">Your Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-glass border-border max-w-2xl rounded-2xl border p-6 md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="from-primary to-primary flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br">
              <User className="text-foreground h-6 w-6" />
            </div>
            <div>
              <h2 className="text-muted-foreground font-semibold">
                {user?.fullName || 'Loading...'}
              </h2>
              <span className="text-primary-light bg-primary/10 rounded-full px-2 py-0.5 text-xs">
                Patient
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (editing ? setEditing(false) : startEditing())}
          >
            {editing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-muted-foreground mb-1 block text-xs">Full Name</label>
              {editing ? (
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              ) : (
                <div className="text-muted-foreground flex items-center gap-2">
                  <User className="text-muted-foreground h-4 w-4" />
                  {user?.fullName || '—'}
                </div>
              )}
            </div>
            <div>
              <label className="text-muted-foreground mb-1 block text-xs">Email</label>
              <div className="text-muted-foreground flex items-center gap-2">
                <Mail className="text-muted-foreground h-4 w-4" />
                {user?.email || '—'}
              </div>
            </div>
            <div>
              <label className="text-muted-foreground mb-1 block text-xs">Phone</label>
              {editing ? (
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              ) : (
                <div className="text-muted-foreground flex items-center gap-2">
                  <Phone className="text-muted-foreground h-4 w-4" />
                  {user?.phone || 'Not provided'}
                </div>
              )}
            </div>
            <div>
              <label className="text-muted-foreground mb-1 block text-xs">Location</label>
              <div className="text-muted-foreground flex items-center gap-2">
                <MapPin className="text-muted-foreground h-4 w-4" />
                India
              </div>
            </div>
          </div>

          {editing && (
            <div className="flex gap-3 pt-4">
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)} disabled={saving}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
