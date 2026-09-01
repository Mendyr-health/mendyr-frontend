'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAuth } from '@/hooks/use-auth';
import { isProfileComplete } from '@/lib/onboarding';
import { ROLE_DASHBOARD_PATH, type Role } from '@/lib/mock-users';
import { Input } from '@mendyr/shared-ui/src/ui/input';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@mendyr/shared-ui/src/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@mendyr/shared-ui/src/ui/form';

const onboardingSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']),
  phone: z.string().min(10, 'Enter a valid phone number').max(15),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

// The form speaks the frontend's uppercase values; `app/core/constants.py`'s Gender enum is
// lowercase, with "prefer not to say" stored as `unspecified`.
const FORM_TO_GENDER: Record<
  OnboardingFormValues['gender'],
  'male' | 'female' | 'other' | 'unspecified'
> = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
  PREFER_NOT_TO_SAY: 'unspecified',
};

const GENDER_TO_FORM: Record<string, OnboardingFormValues['gender']> = {
  male: 'MALE',
  female: 'FEMALE',
  other: 'OTHER',
  unspecified: 'PREFER_NOT_TO_SAY',
};

// Shown right after login when the account is still missing details the app needs
// (see `isProfileComplete`). Submitting persists them to the backend via
// PATCH /users/me — it used to only write localStorage, so the answers never left the
// device and the same user was asked again on every fresh install.
export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading, updateProfile } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const role = (user?.role as Role) || null;

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { fullName: '', dateOfBirth: '', gender: 'PREFER_NOT_TO_SAY', phone: '' },
    mode: 'onTouched',
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    // Reachable directly by URL, and by a stale redirect after the profile is already
    // filled in — don't ask again for details the backend already has.
    if (isProfileComplete(user)) {
      router.replace(ROLE_DASHBOARD_PATH[user.role as Role]);
      return;
    }
    form.reset({
      fullName: user.fullName || '',
      // `date_of_birth` comes back as an ISO timestamp; <input type="date"> only accepts
      // YYYY-MM-DD and silently renders blank for anything else.
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
      gender: (GENDER_TO_FORM[user.gender] ??
        'PREFER_NOT_TO_SAY') as OnboardingFormValues['gender'],
      phone: user.phone || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, router]);

  const onSubmit = async (values: OnboardingFormValues) => {
    if (!role) return;
    setSubmitting(true);
    setError('');
    try {
      await updateProfile({
        fullName: values.fullName,
        phone: values.phone,
        gender: FORM_TO_GENDER[values.gender],
        // The API takes a datetime; the date input gives a bare calendar date.
        dateOfBirth: new Date(`${values.dateOfBirth}T00:00:00Z`).toISOString(),
      });
      router.push(ROLE_DASHBOARD_PATH[role]);
    } catch (err) {
      // Keep the user on the form with their answers intact rather than dropping them into a
      // dashboard whose profile was never actually saved.
      setError(err instanceof Error ? err.message : 'Could not save your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-foreground mb-2 font-[family-name:var(--font-outfit)] text-2xl font-bold">
        Tell us about yourself
      </h1>
      <p className="text-muted-foreground mb-8">
        A few quick details to finish setting up your account.
      </p>

      {error && (
        <div className="border-destructive/20 bg-destructive/10 text-destructive mb-4 rounded-xl border px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Jane Doe" className="h-12 rounded-xl" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" className="h-12 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 w-full rounded-xl">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="h-12 rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="from-primary to-primary/80 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            {submitting ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
