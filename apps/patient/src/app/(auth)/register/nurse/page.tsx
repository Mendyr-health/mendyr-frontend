'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  CheckCircle,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Upload,
  User,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

import { nurseRegistrationFormSchema } from '@/lib/validators';
import { getProfessionalDateOfBirthRange } from '@/lib/date-of-birth';
import { apiFetch } from '@/lib/api-client';
import { cn } from '@mendyr/shared-utils';
import { Input } from '@mendyr/shared-ui/src/ui/input';
import { Textarea } from '@mendyr/shared-ui/src/ui/textarea';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@mendyr/shared-ui/src/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@mendyr/shared-ui/src/ui/popover';
import { Calendar } from '@mendyr/shared-ui/src/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@mendyr/shared-ui/src/ui/select';

type NurseFormValues = z.infer<typeof nurseRegistrationFormSchema>;

type DocType = 'aadhaar' | 'certificate' | 'photo';

const STEPS = ['Personal', 'Professional', 'Documents', 'Review'];
const DOCUMENT_TYPES: DocType[] = ['aadhaar', 'certificate', 'photo'];

export default function NurseRegisterPage() {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState<Partial<Record<DocType, File>>>({});

  const form = useForm<NurseFormValues>({
    resolver: zodResolver(nurseRegistrationFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      gender: 'PREFER_NOT_TO_SAY',
      dateOfBirth: undefined,
      address: '',
      city: '',
      state: '',
      experience: '',
      qualifications: '',
      certifications: '',
      preferredContact: 'email',
    },
    mode: 'onTouched',
  });

  const handleSubmit = async (values: NurseFormValues) => {
    setLoading(true);
    setError('');

    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          dateOfBirth: format(values.dateOfBirth, 'yyyy-MM-dd'),
          role: 'NURSE',
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error?.message || 'Registration failed');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 0) {
      const isValid = await form.trigger([
        'fullName',
        'email',
        'phone',
        'password',
        'gender',
        'dateOfBirth',
      ]);

      if (isValid) {
        setStep(1);
      }
      return;
    }

    if (step === 1) {
      const isValid = await form.trigger([
        'address',
        'city',
        'state',
        'experience',
        'qualifications',
        'certifications',
        'preferredContact',
      ]);

      if (isValid) {
        setStep(2);
      }
      return;
    }

    if (step === 2) {
      setStep(3);
    }
  };

  const openFilePicker = (docType: DocType) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = docType === 'photo' ? 'image/*' : 'image/*,.pdf';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        setFiles((currentFiles) => ({ ...currentFiles, [docType]: file }));
      }
    };
    input.click();
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-12 text-center"
      >
        <CheckCircle className="text-success mx-auto mb-6 h-16 w-16" />
        <h2 className="text-foreground mb-3 text-2xl font-bold">Application Submitted!</h2>
        <p className="text-muted-foreground mb-6">
          Your application has been received. An admin will review your profile and documents.
          We&apos;ll notify you of the outcome.
        </p>
        <Link
          href="/login"
          className="bg-gradient-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-white"
        >
          Go to Login <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    );
  }

  const { earliestDate, latestDate } = getProfessionalDateOfBirthRange();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-foreground mb-2 font-[family-name:var(--font-outfit)] text-2xl font-bold">
        Nurse Application
      </h1>
      <p className="text-muted-foreground mb-6">Apply to join Mendyr&apos;s healthcare network</p>

      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, index) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                index <= step ? 'bg-gradient-primary text-white' : 'bg-muted text-muted-foreground',
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                'hidden truncate text-xs sm:block',
                index <= step ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {label}
            </span>
            {index < STEPS.length - 1 && (
              <div className={cn('mx-1 h-px flex-1', index < step ? 'bg-primary' : 'bg-muted')} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="border-destructive/20 bg-destructive/10 text-destructive mb-4 rounded-xl border px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <div className="relative">
                      <User className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Full name"
                          className="h-12 rounded-xl pl-11"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="you@example.com"
                          className="h-12 rounded-xl pl-11"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <div className="relative">
                      <Phone className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="Phone number"
                          className="h-12 rounded-xl pl-11"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <Lock className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                      <FormControl>
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          className="h-12 rounded-xl pr-11 pl-11"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="text-muted-foreground absolute top-1/2 right-4 -translate-y-1/2"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 w-full rounded-xl border-white/60 bg-white/40 backdrop-blur-md dark:border-white/10 dark:bg-black/20">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background/95 rounded-xl border-white/40 backdrop-blur-md">
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

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <button
                              type="button"
                              className={cn(
                                'focus:ring-primary/40 flex h-12 w-full items-center rounded-xl border border-white/60 bg-white/40 px-4 py-3 text-left text-sm shadow-sm backdrop-blur-md transition-all focus:ring-2 focus:outline-none dark:border-white/10 dark:bg-black/20',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Select a date</span>
                              )}
                            </button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="bg-background/95 w-auto border border-white/40 p-0 shadow-xl backdrop-blur-md"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={field.value}
                            onSelect={(date) => field.onChange(date)}
                            defaultMonth={latestDate}
                            startMonth={earliestDate}
                            endMonth={latestDate}
                            disabled={(date) => date < earliestDate || date > latestDate}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <div className="relative">
                      <MapPin className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                      <FormControl>
                        <Input {...field} placeholder="Address" className="h-12 rounded-xl pl-11" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="City" className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="State" className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="5 years in ICU nursing"
                        className="h-12 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualifications</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder="B.Sc Nursing, GNM, etc."
                        className="rounded-xl border-white/60 bg-white/40 backdrop-blur-md dark:border-white/10 dark:bg-black/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certifications</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder="BLS, ACLS, ICU certification, etc."
                        className="rounded-xl border-white/60 bg-white/40 backdrop-blur-md dark:border-white/10 dark:bg-black/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Contact</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 w-full rounded-xl border-white/60 bg-white/40 backdrop-blur-md dark:border-white/10 dark:bg-black/20">
                          <SelectValue placeholder="Choose preferred contact" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background/95 rounded-xl border-white/40 backdrop-blur-md">
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {DOCUMENT_TYPES.map((docType) => (
                <div
                  key={docType}
                  className="border-border hover:border-primary/30 rounded-xl border border-dashed p-6 text-center transition-colors"
                >
                  {files[docType] ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="text-primary h-5 w-5" />
                      <span className="text-foreground text-sm">{files[docType]?.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFiles((currentFiles) => ({ ...currentFiles, [docType]: undefined }))
                        }
                        className="text-destructive text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openFilePicker(docType)}
                      className="flex w-full flex-col items-center gap-2"
                    >
                      <Upload className="text-muted-foreground h-8 w-8" />
                      <span className="text-muted-foreground text-sm">
                        Upload{' '}
                        {docType === 'aadhaar'
                          ? 'Aadhaar Card'
                          : docType === 'certificate'
                            ? 'Certificate'
                            : 'Profile Photo'}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {docType === 'photo' ? 'JPG, PNG' : 'JPG, PNG, PDF'} (max 5MB)
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-h-64 space-y-3 overflow-y-auto rounded-xl border border-white/60 bg-white/40 p-6 text-sm shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/20"
            >
              {[
                ['Name', form.getValues('fullName')],
                ['Email', form.getValues('email')],
                ['Phone', form.getValues('phone')],
                ['Gender', form.getValues('gender')],
                [
                  'Date of Birth',
                  form.getValues('dateOfBirth') ? format(form.getValues('dateOfBirth'), 'PPP') : '',
                ],
                ['Address', form.getValues('address')],
                ['City', form.getValues('city')],
                ['State', form.getValues('state')],
                ['Experience', form.getValues('experience')],
                ['Preferred Contact', form.getValues('preferredContact')],
              ].map(([label, value]) =>
                value ? (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-foreground max-w-[60%] truncate text-right">{value}</span>
                  </div>
                ) : null,
              )}
              <div className="border-border mt-3 border-t pt-3">
                <p className="text-muted-foreground">
                  Documents: {Object.values(files).filter(Boolean).length}/3 uploaded
                </p>
              </div>
            </motion.div>
          )}

          <div className="mt-6 flex gap-3">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((currentStep) => currentStep - 1)}
                className="border-border text-foreground hover:bg-muted h-12 rounded-xl"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            )}

            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-gradient-primary h-12 flex-1 rounded-xl text-white transition-opacity hover:opacity-90"
              >
                {step === 2 ? 'Review' : 'Next'} <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-primary h-12 flex-1 rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </form>
      </Form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        Already registered?{' '}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
}
