// Mendyr ships as two separate installable apps built from this one codebase:
// a "provider" app for nurses/pharmacists/doctors/admin staff, and a "patient"
// app for patients. Which one a given build produces is controlled by the
// NEXT_PUBLIC_APP_TARGET env var at build time (see package.json's
// build:patient / build:provider scripts, and capacitor.config.ts for the
// matching native appId/appName).
export type AppTarget = 'patient' | 'provider';

export const APP_TARGET: AppTarget =
  process.env.NEXT_PUBLIC_APP_TARGET === 'provider' ? 'provider' : 'patient';

export const IS_PATIENT_APP = APP_TARGET === 'patient';
export const IS_PROVIDER_APP = APP_TARGET === 'provider';

export const APP_TARGET_CONFIG = {
  patient: {
    displayName: 'Mendyr',
    tagline: 'Healthcare that comes home to you.',
    primaryCta: { label: 'Get Started', href: '/register/patient' },
    secondaryCta: { label: 'Sign In', href: '/login' },
  },
  provider: {
    displayName: 'Mendyr Pro',
    tagline: 'Manage visits, patients & earnings on the go.',
    primaryCta: { label: 'Apply as a Provider', href: '/register/nurse' },
    secondaryCta: { label: 'Sign In', href: '/login' },
  },
} as const satisfies Record<AppTarget, unknown>;
