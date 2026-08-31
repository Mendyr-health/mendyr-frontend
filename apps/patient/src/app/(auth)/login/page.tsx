'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

import { loginSchema } from '@/lib/validators';
import { apiFetch } from '@/lib/api-client';
import { inferRoleFromEmail, getMockUserForRole, ROLE_DASHBOARD_PATH } from '@/lib/mock-users';
import { saveMockSession } from '@/lib/mock-session';
import { isOnboardingComplete } from '@/lib/onboarding';
import { adaptBackendRole } from '@/lib/user-adapter';
import { IS_PROVIDER_APP, IS_PATIENT_APP } from '@/lib/app-target';
import { usePlatform } from '@mendyr/shared-utils';
import { Input } from '@mendyr/shared-ui/src/ui/input';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@mendyr/shared-ui/src/ui/form';

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { isCapacitor } = usePlatform();
  // The web build is one shared marketing site with both sign-up paths.
  // The native builds are two separate apps (see src/lib/app-target.ts) —
  // each one should only offer its own registration path.
  const showPatientRegister = !isCapacitor || IS_PATIENT_APP;
  const showNurseRegister = !isCapacitor || IS_PROVIDER_APP;
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const proceedPastLogin = (role: keyof typeof ROLE_DASHBOARD_PATH) => {
    router.push(isOnboardingComplete(role) ? ROLE_DASHBOARD_PATH[role] : '/onboarding');
  };

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError('');

    let res: Response;
    try {
      res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
    } catch {
      // The request itself never completed — DNS/connection/CORS failure, no backend
      // reachable. Sign in with a dummy account instead of dead-ending, so the app can be
      // exercised end-to-end. Pick the role from a keyword in the email (e.g.
      // "nurse@test.com", "admin@test.com"); this fallback stops mattering the moment a
      // real API responds. Deliberately NOT wrapping the response-handling below in this
      // same catch: a bug in handling a real response (once masked a working login as a
      // mock one — see git blame) must surface as a real error, not vanish into this path.
      const role = inferRoleFromEmail(values.email);
      saveMockSession(getMockUserForRole(role, values.email));
      proceedPastLogin(role);
      setLoading(false);
      return;
    }

    try {
      const data = await res.json();
      if (!data.success) {
        setError(data.error?.message || 'Invalid credentials');
        return;
      }
      proceedPastLogin(adaptBackendRole(data.data.user.role));
    } catch {
      setError('Something went wrong while signing in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-foreground mb-2 font-[family-name:var(--font-outfit)] text-2xl font-bold">
        Welcome back
      </h1>
      <p className="text-muted-foreground mb-8">Sign in to your Mendyr account</p>

      {error && (
        <div className="border-destructive/20 bg-destructive/10 text-destructive mb-4 rounded-xl border px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <FormLabel>Password</FormLabel>
                  <Link href="/forgot-password" className="text-primary text-xs hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="h-12 rounded-xl pr-11 pl-11"
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-muted-foreground absolute top-1/2 right-4 -translate-y-1/2"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="from-primary to-primary/80 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Form>

      <div className="my-6 flex items-center gap-4">
        <div className="bg-muted h-px flex-1" />
        <span className="text-muted-foreground text-xs">or continue with</span>
        <div className="bg-muted h-px flex-1" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        className="border-border text-foreground hover:bg-muted flex h-12 w-full items-center justify-center gap-3 rounded-xl transition-colors"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>

      {(showPatientRegister || showNurseRegister) && (
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Don&apos;t have an account?{' '}
          {showPatientRegister && (
            <Link href="/register/patient" className="text-primary font-medium hover:underline">
              Register as Patient
            </Link>
          )}
          {showPatientRegister && showNurseRegister && <> or </>}
          {showNurseRegister && (
            <Link href="/register/nurse" className="text-primary font-medium hover:underline">
              Apply as Nurse
            </Link>
          )}
        </p>
      )}
    </motion.div>
  );
}
