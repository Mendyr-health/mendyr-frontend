import type { Role } from "@/lib/mock-users";

// Tracks whether a user has completed the post-login "tell us about
// yourself" step. Backed by localStorage for now since there's no backend
// to persist a profile-completion flag on the user record yet.
export interface OnboardingProfile {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
}

function storageKey(role: Role): string {
  return `mendyr_onboarding_${role}`;
}

export function isOnboardingComplete(role: Role): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(storageKey(role)) !== null;
}

export function getOnboardingProfile(role: Role): OnboardingProfile | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(storageKey(role));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OnboardingProfile;
  } catch {
    return null;
  }
}

export function markOnboardingComplete(role: Role, profile: OnboardingProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(role), JSON.stringify(profile));
}
